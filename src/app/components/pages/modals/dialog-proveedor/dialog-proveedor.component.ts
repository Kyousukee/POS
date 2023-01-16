import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'src/app/interfaces/usuario';
import { ProveedorServiciosService } from 'src/app/servicios/proveedor-servicios.service';
import { Proveedor } from '../../../../interfaces/proveedor';

@Component({
  selector: 'app-dialog-proveedor',
  templateUrl: './dialog-proveedor.component.html',
  styleUrls: ['./dialog-proveedor.component.css']
})
export class DialogProveedorComponent implements OnInit {

  formProveedor: FormGroup;
  accion: string = "Agregar"
  accionBoton: string = "Guardar";
  UsuarioLogueado!: Usuario;

  constructor(
    private dialogoReferencia: MatDialogRef<DialogProveedorComponent>,
    @Inject(MAT_DIALOG_DATA) public proveedorEditar: Proveedor,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _proveedorServicio: ProveedorServiciosService
  ) {
    this.formProveedor = this.fb.group({
      rut_proveedor: ['', Validators.required],
      desc_proveedor: ['', Validators.required],
      esActivo:[Validators.required]
    })


    if (this.proveedorEditar) {

      this.accion = "Editar";
      this.accionBoton = "Actualizar";
    }

    if (sessionStorage.getItem('session')) {
      this.UsuarioLogueado = JSON.parse(sessionStorage.getItem('session')!) || '';
    }
   }

  ngOnInit(): void {
    if (this.proveedorEditar) {
      this.formProveedor.patchValue({
        rut_proveedor: this.proveedorEditar.rut_proveedor,
        desc_proveedor: String(this.proveedorEditar.desc_proveedor),
        esActivo:this.proveedorEditar.esActivo
      })
    }
  }

  agregarEditarProveedor() {

    const _proveedor: Proveedor = {
      id_proveedor: this.proveedorEditar == null ? 0 : this.proveedorEditar.id_proveedor,
      rut_proveedor: this.formProveedor.value.rut_proveedor,
      desc_proveedor: this.formProveedor.value.desc_proveedor,
      esActivo: this.formProveedor.value.esActivo,
      id_local: this.UsuarioLogueado.idLocal,
      usuario: this.UsuarioLogueado == null ? "" : this.UsuarioLogueado.usuario
    }

    if (this.proveedorEditar) {

      this._proveedorServicio.edit(_proveedor).subscribe({
        next: (data) => {

          if (data.status) {
            this.mostrarAlerta("El proveedor fue editado", "Exito");
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

      this._proveedorServicio.save(_proveedor).subscribe({
        next: (data) => {

          if (data.status) {
            this.mostrarAlerta("El proveedor fue registrado", "Exito");
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

}
