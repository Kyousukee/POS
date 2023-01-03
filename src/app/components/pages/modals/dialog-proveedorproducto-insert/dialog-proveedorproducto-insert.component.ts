import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Producto } from 'src/app/interfaces/producto';
import { ProveedorproductoRequest } from 'src/app/interfaces/proveedorproducto-request';
import { Usuario } from 'src/app/interfaces/usuario';
import { ProductosServiciosService } from 'src/app/servicios/productos-servicios.service';
import { ProveedorServiciosService } from 'src/app/servicios/proveedor-servicios.service';
import { Proveedorproducto } from '../../../../interfaces/proveedorproducto';

@Component({
  selector: 'app-dialog-proveedorproducto-insert',
  templateUrl: './dialog-proveedorproducto-insert.component.html',
  styleUrls: ['./dialog-proveedorproducto-insert.component.css']
})
export class DialogProveedorproductoInsertComponent implements OnInit {

  formProveedorProducto: FormGroup;
  accion: string = "Agregar"
  accionBoton: string = "Guardar";
  UsuarioLogueado!: Usuario;
  options: Producto[] = [];
  Productossss: Producto[] = [];
  agregarProducto!: Producto;
  cobroPor:number = 1;
  filteredOptions!: Producto[];

  constructor(
    private dialogoReferencia: MatDialogRef<DialogProveedorproductoInsertComponent>,
    @Inject(MAT_DIALOG_DATA) public request: ProveedorproductoRequest,
    private _productoServicio: ProductosServiciosService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _proveedorServicio: ProveedorServiciosService
  ) {
    this.formProveedorProducto = this.fb.group({
      codbarras: [''],
      producto2: [''],
      producto: ['', Validators.required],
      precio: ['', Validators.required],
      esActivo:[Validators.required]
    })

    this.formProveedorProducto.get('producto')?.valueChanges.subscribe(value => {
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

    if (this.request.proveedorProductoEditar) {

      this.accion = "Editar";
      this.accionBoton = "Actualizar";
    }

    if (sessionStorage.getItem('session')) {
      this.UsuarioLogueado = JSON.parse(sessionStorage.getItem('session')!) || '';
    }
  }

  ngOnInit(): void {

    if (this.request.proveedorProductoEditar) {

    this.formProveedorProducto = this.fb.group({
      producto2: [this.request.proveedorProductoEditar.desc_producto],
      precio: [parseFloat(this.request.proveedorProductoEditar.precio), Validators.required],
      codbarras: [''],
      esActivo:[this.request.proveedorProductoEditar.esActivo,Validators.required],
      //editar:[this.proveedorProductoEditar.id_proPre]
    })


    }

  }


  private _filter(value: any): Producto[] {
    const filterValue = typeof value === "string" ? value.toLowerCase() : value.nombre.toLowerCase();
    return this.options.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  displayProducto(producto: Producto): string {
    return producto.nombre;
  }

  productoSeleccionado(event: any) {
    this.agregarProducto = event.option.value;
    
    this.cobroPor = this.agregarProducto.id_cob;
  }

  onEnterCodBarras(event: any) {   
    
    const codbarr = event.target.value;

    this.formProveedorProducto.patchValue({
      codbarras:''
    })
    
    if (this.options.find(x => x.codBarras == codbarr)) {

      this.agregarProducto = this.options.find(x => x.codBarras == codbarr)!;

      this.cobroPor = this.agregarProducto.id_cob;

      this.formProveedorProducto.patchValue({
        producto:this.agregarProducto,
        cantidad:1
      })
    }else{

      this._snackBar.open("No se encontro el producto en los registros", "Oops", {
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 3000
      });

    }
    
  }

  agregarEditarProveedorProducto() {
    
    let idprodu:number;
    if (this.agregarProducto) {
      idprodu = this.agregarProducto.idProducto
    }else{
      idprodu = this.request.proveedorProductoEditar!.id_producto
    }

    const _proveedorProducto: Proveedorproducto = {
      id_proPre:this.request.proveedorProductoEditar == null ? 0 : this.request.proveedorProductoEditar.id_proPre,
      id_proveedor: this.request.id,
      desc_proveedor: '',
      id_producto: idprodu,
      desc_producto: '',
      precio:this.formProveedorProducto.value.precio,
      esActivo: this.formProveedorProducto.value.esActivo
    }

    if (this.request.proveedorProductoEditar) {

      this._proveedorServicio.editProducto(_proveedorProducto).subscribe({
        next: (data) => {

          if (data.status) {
            this.mostrarAlerta("El producto fue editado", "Exito");
            this.dialogoReferencia.close('editado')
          } else {
            this.mostrarAlerta("No se pudo editar el producto", "Error");
          }

        },
        error: (e) => {
          console.log(e)
        },
        complete: () => {
        }
      })


    } else {

      this._proveedorServicio.saveProducto(_proveedorProducto).subscribe({
        next: (data) => {

          if (data.status) {
            this.mostrarAlerta("El producto fue registrado", "Exito");
            this.dialogoReferencia.close('agregado')
          } else {
            this.mostrarAlerta("No se pudo registrar el producto", "Error");
          }

        },
        error: (e) => {
        },
        complete: () => {
        }
      })


    }
    
  }

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }

}
