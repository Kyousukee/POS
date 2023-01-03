import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DetalleVenta } from '../../../interfaces/detalle-venta';
import { Producto } from '../../../interfaces/producto';
import { Venta } from '../../../interfaces/venta';
import { ProductosServiciosService } from '../../../servicios/productos-servicios.service';
import { VentasServiciosService } from '../../../servicios/ventas-servicios.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogResultadoVentaComponent } from '../modals/dialog-resultado-venta/dialog-resultado-venta.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInput } from '@angular/material/input';
import { Usuario } from 'src/app/interfaces/usuario';



@Component({
  selector: 'app-vender',
  templateUrl: './vender.component.html',
  styleUrls: ['./vender.component.css']
})


export class VenderComponent implements OnInit {

  options: Producto[] = [];
  ELEMENT_DATA: DetalleVenta[] = [];
  deshabilitado: boolean = false;

  cobroPor:number = 1;

  filteredOptions!: Producto[];
  agregarProducto!: Producto;
  tipodePago: string = "Efectivo";
  totalPagar: number = 0;

  formGroup: FormGroup;
  displayedColumns: string[] = ['producto','cobro', 'cantidad', 'precio', 'total','accion'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  orden:number = 0;
  UsuarioLogueado!: Usuario;

  constructor(
    private fb: FormBuilder,
    private _productoServicio: ProductosServiciosService,
    private _ventaServicio: VentasServiciosService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
    
  ) {
    
    this.formGroup = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', Validators.required],
      codbarras: ['']
    })

    
    

    this.formGroup.get('producto')?.valueChanges.subscribe(value => {
      this.filteredOptions =  this._filter(value)
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

    if (sessionStorage.getItem('session')) {
      this.UsuarioLogueado = JSON.parse(sessionStorage.getItem('session')!) || '';
    }

   }

  ngOnInit(): void {
    
    
    document.getElementById('codbarras1')!.focus();
  }

  private _filter(value: any): Producto[] {
    const filterValue = typeof value === "string" ? value.toLowerCase() : value.nombre.toLowerCase();
    return this.options.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  displayProducto(producto: Producto): string {
    return producto.nombre;
  }

  productoSeleccionado(event: any) {
    // console.log(event.option.value);
    if (event.option.value.precioCompra == 0) {
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
    }else{
      this.agregarProducto = event.option.value;
    
      this.cobroPor = this.agregarProducto.id_cob;
    }
    
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

    
    
    
    // console.log(this.agregarProducto.stock);
    // console.log(this.formGroup.value.cantidad);
    if (this.agregarProducto.stock>=this.formGroup.value.cantidad) {

      const item:DetalleVenta = this.ELEMENT_DATA.find(p => p.idProducto == this.agregarProducto.idProducto)!

      if (item != undefined){

        item.cantidad = item.cantidad + this.formGroup.value.cantidad
        item.totalTexto = String((item.cantidad*parseFloat(this.agregarProducto.precio)).toFixed(2))

        this.ELEMENT_DATA = this.ELEMENT_DATA.filter(p => p.orden != item.orden)

        this.totalPagar = this.totalPagar + (this.formGroup.value.cantidad*parseFloat(this.agregarProducto.precio));

        this.ELEMENT_DATA.push(
          {
            orden:item.orden,
            idProducto: item.idProducto,
            descripcionProducto: item.descripcionProducto,
            descripcionCobro:item.descripcionCobro,
            cantidad: item.cantidad,
            precioTexto: String(parseFloat(this.agregarProducto.precio).toFixed(2)),
            totalTexto: String(parseFloat(item.totalTexto).toFixed(2))
          })

        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        document.getElementById('codbarras1')!.focus();
        this.formGroup.patchValue({
          producto: '',
          cantidad: '',
          codbarras:''
        })
      }else{
        let _total: number;
        this.orden++;
        const _cantidad: number = this.formGroup.value.cantidad;
        const _precio: number = parseFloat(this.agregarProducto.precio);
        if (this.cobroPor=2) {
          
          
            _total = _cantidad * _precio;
          
        }else {
            _total = _cantidad * _precio;
        }
        
        
        this.totalPagar = this.totalPagar + _total;

        this.ELEMENT_DATA.push(
          {
            orden:this.orden,
            idProducto: this.agregarProducto.idProducto,
            descripcionCobro: this.agregarProducto.CobDescripcion,
            descripcionProducto: this.agregarProducto.nombre,
            cantidad: _cantidad,
            precioTexto: String(_precio.toFixed(2)),
            totalTexto: String(_total.toFixed(2))
          })
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        document.getElementById('codbarras1')!.focus();
        this.formGroup.patchValue({
          producto: '',
          cantidad: '',
          codbarras:''
        })
      }

      

    }else{
      this._snackBar.open("No se pudo agregar producto, ya que sobregira stock, quedan: "+this.agregarProducto.stock, "Oops", {
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 3000
      });
    }

    

  }

  eliminarProducto(item: DetalleVenta) {
    // console.log(item);
    this.totalPagar = this.totalPagar - parseFloat(item.totalTexto);
    this.ELEMENT_DATA = this.ELEMENT_DATA.filter(p => p.orden != item.orden)

    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    document.getElementById('codbarras1')!.focus();
  }

  descontarProducto(item: DetalleVenta) {

    item.cantidad--

    item.totalTexto  = (parseFloat(item.totalTexto) - parseFloat(item.precioTexto)).toString()
    

    this.totalPagar = this.totalPagar - parseFloat(item.precioTexto);
    // this.ELEMENT_DATA = this.ELEMENT_DATA.filter(p => p.orden != item.orden)

    

    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    document.getElementById('codbarras1')!.focus();
  }

  registrarCompra() {

    if (this.ELEMENT_DATA.length > 0) {

      this.deshabilitado = true;
      

      const ventaDto: Venta = {
        tipoPago: this.tipodePago,
        total: String(this.totalPagar.toFixed(2)),
        listDetalleVenta: this.ELEMENT_DATA,
        id_local: this.UsuarioLogueado.idLocal
      }

      // console.log(ventaDto);

      this._ventaServicio.registrar(ventaDto).subscribe({
        next: (data) => {

          if (data.status) {
            this.totalPagar = 0.00;
            this.ELEMENT_DATA = [];
            this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
            this.tipodePago = "Efectivo";

            this.dialog.open(DialogResultadoVentaComponent, {
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

      document.getElementById('codbarras1')!.focus();


    }
  }

  
}
