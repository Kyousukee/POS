import { Component, forwardRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators  } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DetalleCompra } from '../../../interfaces/detalle-compra';
import { Producto } from '../../../interfaces/producto';
import { Compra } from '../../../interfaces/compra';
import { ProductosServiciosService } from '../../../servicios/productos-servicios.service';
import { ProveedorServiciosService } from '../../../servicios/proveedor-servicios.service';
import { ComprasServiciosService } from '../../../servicios/compras-servicios.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogResultadoCompraComponent } from '../modals/dialog-resultado-compra/dialog-resultado-compra.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'src/app/interfaces/usuario';
import { Proveedor } from '../../../interfaces/proveedor';
import { DialogCambiarProveedorCompraComponent } from '../modals/dialog-cambiar-proveedor-compra/dialog-cambiar-proveedor-compra.component';



@Component({
  selector: 'app-comprar',
  templateUrl: './comprar.component.html',
  styleUrls: ['./comprar.component.css'],
  
})
export class ComprarComponent implements OnInit {
  options: Producto[] = [];
  proveedores: Proveedor[] = [];
  ELEMENT_DATA: DetalleCompra[] = [];
  deshabilitado: boolean = false;

  filteredOptions!: Producto[];
  filteredproveedores!: Proveedor[];
  agregarProducto!: Producto;
  agregarProveedor!: Proveedor;
  tipodePago: string = "Efectivo";
  totalPagar: number = 0;
  comProveedor: boolean = true;

  cobroPor:number = 1;

  precioCompraProveedor:number = 0

  formGroup: FormGroup;
  displayedColumns: string[] = ['producto','cobro', 'cantidad', 'precio', 'total','accion'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  orden:number = 0;
  UsuarioLogueado!: Usuario;

  constructor(private fb: FormBuilder,
    private _productoServicio: ProductosServiciosService,
    private _proveedorServicio: ProveedorServiciosService,
    private _compraServicio: ComprasServiciosService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
    ) {
      
      this.formGroup = this.fb.group({
        producto: ['', Validators.required],
        cantidad: ['', Validators.required],
        codbarras: [''],
        compraProveedor: [false],
        proveedorForm:['']
      })

      this.formGroup.get('producto')?.valueChanges.subscribe(value => {
        this.filteredOptions =  this._filter(value)
      })

      this.formGroup.get('proveedorForm')?.valueChanges.subscribe(value => {
        this.filteredproveedores =  this._filter2(value)
      })
  
      this._productoServicio.getProductos().subscribe({
        next: (data) => {
          if (data.status)
            this.options = data.value;
        },
        error: (e) => {
        },
        complete: () => {
  
        }
      })

      this._proveedorServicio.getProveedores().subscribe({
        next: (data) => {
          if (data.status)
            this.proveedores = data.value;
        },
        error: (e) => {
        },
        complete: () => {
  
        }
      })

      if (sessionStorage.getItem('session')) {
        this.UsuarioLogueado = JSON.parse(sessionStorage.getItem('session')!) || '';
      }

     }

  ngOnInit(): void {
    document.getElementById('codbarras')!.focus();
  }

  private _filter(value: any): Producto[] {
    const filterValue = typeof value === "string" ? value.toLowerCase() : value.nombre.toLowerCase();
    return this.options.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  private _filter2(value: any): Proveedor[] {
    const filterValue = typeof value === "string" ? value.toLowerCase() : value.desc_proveedor.toLowerCase();
    return this.proveedores.filter(pro => pro.desc_proveedor.toLowerCase().includes(filterValue));
  }


  displayProducto(producto: Producto): string {
    return producto.nombre;
  }

  displayProveedor(proveedor: Proveedor): string {
    
    return proveedor.desc_proveedor;
  }

  productoSeleccionado(event: any) {
    this.agregarProducto = event.option.value;
    // console.log(this.agregarProducto);
    this.cobroPor = this.agregarProducto.id_cob;
    if (this.agregarProveedor) {
      if (this.comProveedor==false){
        this._productoServicio.getPrecioCompra(this.agregarProducto.idProducto,this.agregarProveedor.id_proveedor).subscribe({
          next: (data) => {
            
            if (data.status){
              this.precioCompraProveedor = data.value;
            }else{
              this._snackBar.open("Producto no encontrado con el Proveedor, se utilizara precio fijo de compra.", "Oops", {
                horizontalPosition: "end",
                verticalPosition: "top",
                duration: 4000
              });
            }
            
          },
          error: (e) => {
          },
          complete: () => {
    
          }
        })
      }
      
    }

    if (this.precioCompraProveedor == 0 && event.option.value.precioCompra == 0) {
      this._snackBar.open("Producto sin Precio Ingresado", "Oops", {
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 3000
      });
      this.formGroup = this.fb.group({
        producto: ['', Validators.required],
        cantidad: ['', Validators.required],
        codbarras: ['']
      })
    }
    
  }

  proveedorSeleccionado(event: any) {

    if (this.agregarProveedor) {
      if (this.agregarProveedor != event.option.value) {
        this.dialog.open(DialogCambiarProveedorCompraComponent, {
          disableClose: true,
        }).afterClosed().subscribe(result => {
    
          if (result === "cambiar") {
    
            this.agregarProveedor = event.option.value;
            this.totalPagar = 0.00;
            this.ELEMENT_DATA = [];
            this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
            this.tipodePago = "Efectivo";
            document.getElementById('codbarras')!.focus();
    
          }

        });
      }
      document.getElementById('codbarras')!.focus();
    }else{
      this.agregarProveedor = event.option.value;
      document.getElementById('codbarras')!.focus();
    }
    document.getElementById('codbarras')!.focus();
    
    // console.log(this.agregarProducto);
  }

  onEnterCodBarras(event: any) {   
    
    const codbarr = event.target.value;

    this.formGroup.patchValue({
      codbarras:''
    })
    
    if (this.options.find(x => x.codBarras == codbarr)) {

      this.agregarProducto = this.options.find(x => x.codBarras == codbarr)!;

      this.cobroPor = this.agregarProducto.id_cob;

      this.formGroup.patchValue({
        producto:this.agregarProducto,
        cantidad:1
      })
      this.onSubmitForm();
    }else{

      this._snackBar.open("No se encontro el producto en los registros", "Oops", {
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 3000
      });

    }
    
  }

  onSubmitForm() {

    const item:DetalleCompra = this.ELEMENT_DATA.find(p => p.idProducto == this.agregarProducto.idProducto)!

    let _precio: number =0;
    
    // console.log(this.agregarProducto);
    if (this.agregarProducto.precioProveedor) {
      _precio =this.precioCompraProveedor;
      
    }else{
      _precio = parseFloat(this.agregarProducto.precioCompra);
    }
    
    // console.log(_precio);

    if (item != undefined) {

      item.cantidad = item.cantidad + this.formGroup.value.cantidad
      item.totalTexto = String((item.cantidad*_precio).toFixed(2))

      this.ELEMENT_DATA = this.ELEMENT_DATA.filter(p => p.orden != item.orden)

      this.totalPagar = this.totalPagar + (this.formGroup.value.cantidad*_precio);

      this.ELEMENT_DATA.push(
        {
          orden:item.orden,
          idProducto: item.idProducto,
          descripcionProducto: item.descripcionProducto,
          descripcionCobro:item.descripcionCobro,
          cantidad: item.cantidad,
          precioTexto: String(_precio.toFixed(2)),
          totalTexto: String(parseFloat(item.totalTexto).toFixed(2))
        })

      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      document.getElementById('codbarras')!.focus();
      this.formGroup.patchValue({
        producto: '',
        cantidad: '',
        codbarras:''
      })
    }else{
      this.orden++;
      const _cantidad: number = this.formGroup.value.cantidad;
      const _total: number = _cantidad * _precio;
      this.totalPagar = this.totalPagar + _total;

      this.ELEMENT_DATA.push(
        {
          orden:this.orden,
          idProducto: this.agregarProducto.idProducto,
          descripcionProducto: this.agregarProducto.nombre,
          descripcionCobro:this.agregarProducto.CobDescripcion,
          cantidad: _cantidad,
          precioTexto: String(_precio.toFixed(2)),
          totalTexto: String(_total.toFixed(2))
        })
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      document.getElementById('codbarras')!.focus();
      this.formGroup.patchValue({
        producto: '',
        cantidad: '',
        codbarras:''
      })

    }

    
  }

  eliminarProducto(item: DetalleCompra) {

    this.totalPagar = this.totalPagar - parseFloat(item.totalTexto);
    this.ELEMENT_DATA = this.ELEMENT_DATA.filter(p => p.orden != item.orden)

    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    document.getElementById('codbarras')!.focus();
  }

  descontarProducto(item: DetalleCompra) {

    item.cantidad--

    item.totalTexto  = (parseFloat(item.totalTexto) - parseFloat(item.precioTexto)).toString()
    

    this.totalPagar = this.totalPagar - parseFloat(item.precioTexto);
    // this.ELEMENT_DATA = this.ELEMENT_DATA.filter(p => p.orden != item.orden)

    

    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    document.getElementById('codbarras')!.focus();
  }

  registrarVenta() {

    if (this.ELEMENT_DATA.length > 0) {

      this.deshabilitado = true;
      

      const ventaDto: Compra = {
        tipoPago: this.tipodePago,
        total: String(this.totalPagar.toFixed(2)),
        ListDetalleCompra: this.ELEMENT_DATA,
        id_local: this.UsuarioLogueado.idLocal,
        conProveedor: this.formGroup.value.compraProveedor,
        IdProveedor: this.agregarProveedor == null ? 0 : this.agregarProveedor.id_proveedor
      }

      

      this._compraServicio.registrar(ventaDto).subscribe({
        next: (data) => {

          if (data.status) {
            this.totalPagar = 0.00;
            this.ELEMENT_DATA = [];
            this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
            this.tipodePago = "Efectivo";

            this.dialog.open(DialogResultadoCompraComponent, {
              data: {
                numero: data.value.numeroDocumento
              },
            });

          } else {
            this._snackBar.open("No se pudo registrar la venta", "Oops", {
              horizontalPosition: "end",
              verticalPosition: "top",
              duration: 3000
            });
          }
        },
        error: (e) => {
        },
        complete: () => {
          this.deshabilitado = false;
        }
      })

      document.getElementById('codbarras')!.focus();
    }
  }

  compraProveedor(value: boolean) {
    if (value==true) {
      this.comProveedor = false;
      this.formGroup.patchValue({
        producto: '',
        cantidad: '',
        codbarras:'',
        proveedorForm:''
      })

    }else{
      
      this.comProveedor = true;

      
    }
  }

}
