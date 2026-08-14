import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Categoria } from '../../../../interfaces/categoria';
import { Producto } from '../../../../interfaces/producto';
import { CategoriasServiciosService } from '../../../../servicios/categorias-servicios.service';
import { ProductosServiciosService } from '../../../../servicios/productos-servicios.service';
import { PorCobrarservicioService } from '../../../../servicios/por-cobrarservicio.service';
import { CobrarPor } from '../../../../interfaces/CobrarPor';
import { Usuario } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-dialog-producto',
  templateUrl: './dialog-producto.component.html',
  styleUrls: ['./dialog-producto.component.css']
})
export class DialogProductoComponent implements OnInit {
  formProducto: FormGroup;
  accion: string = "Agregar"
  accionBoton: string = "Guardar";
  listaCategorias: Categoria[] = [];
  listaCobros: CobrarPor[] = [];
  UsuarioLogueado!: Usuario;
  precioProve:boolean = true;
  precioPropo:boolean = true;
  localPrecioCompra:boolean = false;



  constructor(
    private dialogoReferencia: MatDialogRef<DialogProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public productoEditar: Producto,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _categoriaServicio: CategoriasServiciosService,
    private _productoServicio: ProductosServiciosService,
    private _porCobrarServicio: PorCobrarservicioService
  ) {
    this.formProducto = this.fb.group({
      nombre: ['', Validators.required],
      // idCategoria: ['', Validators.required],
      idCob: ['', Validators.required],
      precio: ['', Validators.required],
      precioCompra: [''],
      codbarra:[''],
      stock: ['', Validators.required],
      precioProveedor:[false,Validators.required],
      precioProporcional:[false,Validators.required],
      esActivo:[Validators.required]
    })

    this.precioProve = false;


    if (this.productoEditar) {

      this.accion = "Editar";
      this.accionBoton = "Actualizar";
    }

    // this._categoriaServicio.getCategorias().subscribe({
    //   next: (data) => {

    //     if (data.status) {

    //       this.listaCategorias = data.value;

    //       if (this.productoEditar)
    //         this.formProducto.patchValue({
    //           idCategoria: this.productoEditar.idCategoria
    //         })

    //     }
    //   },
    //   error: (e) => {
    //   },
    //   complete: () => {
    //   }
    // })

    this._porCobrarServicio.getCobros().subscribe({
      next: (data) => {

        if (data.status) {

          this.listaCobros = data.value;

          if (this.productoEditar)
            this.formProducto.patchValue({
              idCob: this.productoEditar.id_cob
            })

        }
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

    if (this.productoEditar) {
      if (this.productoEditar.precioProporcional) {
        this.precioPropo = false;
      }else{
        
        this.precioPropo = true;
      }

      if (this.productoEditar.precioProveedor) {
        this.precioProve = true;
      }else{
        this.precioProve = false;
      }

      // console.log(this.productoEditar)
      this.formProducto.patchValue({
        nombre: this.productoEditar.nombre,
        // idCategoria: String(this.productoEditar.idCategoria),
        idCob: this.productoEditar.id_cob,
        precio: this.productoEditar.precioProporcional ? this.productoEditar.porcentaje : this.productoEditar.precio,
        precioCompra:this.productoEditar.precioCompra,
        codbarra:this.productoEditar.codBarras,
        stock: this.productoEditar.stock,
        precioProveedor: this.productoEditar.precioProveedor,
        precioProporcional: this.productoEditar.precioProporcional,
        esActivo:this.productoEditar.esActivo
      })
    }

    if (this.UsuarioLogueado.idtipolocal == 2) {
      this.localPrecioCompra = true;
    }
  }

  agregarEditarProducto() {

    const _producto: Producto = {
      idProducto: this.productoEditar == null ? 0 : this.productoEditar.idProducto,
      nombre: this.formProducto.value.nombre,
      // idCategoria: this.formProducto.value.idCategoria,
      descripcionCategoria : "",
      precio: this.formProducto.value.precio,
      precioCompra: this.formProducto.value.precioCompra,
      id_cob: this.formProducto.value.idCob,
      stock: this.formProducto.value.stock,
      CobDescripcion: "",
      codBarras: this.formProducto.value.codbarra,
      esActivo: this.formProducto.value.esActivo,
      precioProveedor: this.formProducto.value.precioProveedor,
      precioProporcional: this.formProducto.value.precioProporcional,
      id_local: this.UsuarioLogueado.idLocal,
      porcentaje:"0",
      usuario: this.UsuarioLogueado == null ? "" : this.UsuarioLogueado.usuario
      
    }

    
    if (this.productoEditar) {

      this._productoServicio.edit(_producto).subscribe({
        next: (data) => {

          if (data.status) {
            this.mostrarAlerta("El producto fue editado", "Exito");
            this.dialogoReferencia.close('editado')
          } else {
            this.mostrarAlerta(data.msg, "Error");
          }

        },
        error: (e) => {
          console.log(e)
        },
        complete: () => {
        }
      })


    } else {

      this._productoServicio.save(_producto).subscribe({
        next: (data) => {

          if (data.status) {
            this.mostrarAlerta("El producto fue registrado", "Exito");
            this.dialogoReferencia.close('agregado')
          } else {
            this.mostrarAlerta(data.msg, "Error");
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

  precioProveedor(value: boolean) {
    if (value==true) {
      this.precioProve = true;
    }else{
      this.precioProve = false;
    }
  }

  precioProporcional(value: boolean) {
    if (value==true) {
      this.precioPropo = false;
    }else{
      
      this.precioPropo = true;
    }
  }

}
