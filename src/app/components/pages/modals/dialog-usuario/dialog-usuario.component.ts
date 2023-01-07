import { Component, Inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Local } from 'src/app/interfaces/local';
import { LocalServicioService } from 'src/app/servicios/local-servicio.services';
import { Rol } from '../../../../interfaces/rol';
import { Usuario } from '../../../../interfaces/usuario';
import { RolServicioService } from '../../../../servicios/rol-servicio.service';
import { UsuarioServicioService } from '../../../../servicios/usuario-servicio.service';
@Component({
  selector: 'app-dialog-usuario',
  templateUrl: './dialog-usuario.component.html',
  styleUrls: ['./dialog-usuario.component.css']
})
export class DialogUsuarioComponent implements OnInit, AfterViewInit {
  formUsuario: FormGroup;
  hide: boolean = true;
  accion:string ="Agregar"
  accionBoton: string = "Guardar";
  listaRoles: Rol[] = [];
  listaLocal: Local[] = [];
  UsuarioLogueado!: Usuario;

  constructor(
    private dialogoReferencia: MatDialogRef<DialogUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public usuarioEditar: Usuario,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _rolServicio: RolServicioService,
    private _usuarioServicio: UsuarioServicioService,
    private _localServicio: LocalServicioService
  )
  {

    this.formUsuario = this.fb.group({
      nombreApellido: ['', Validators.required],
      correo: ['', Validators.required],
      idRol: ['', Validators.required],
      // idLocal: ['', Validators.required],
      clave: ['', Validators.required],
      esActivo: [true, Validators.required],
    })


    if (this.usuarioEditar) {
      this.accion = "Editar";
      this.accionBoton = "Actualizar";
    }

    this._rolServicio.getRoles().subscribe({
      next: (data) => {
        
        if (data.status) {
          this.listaRoles = data.value;

          if (this.usuarioEditar)
            this.formUsuario.patchValue({
              idRol: this.usuarioEditar.idRol
            })

        }
      },
      error: (e) => {
      },
      complete: () => {
      }
    })

    // this._localServicio.getLocales().subscribe({
    //   next: (data) => {

    //     if (data.status) {

    //       this.listaLocal = data.value;

    //       if (this.usuarioEditar)
    //         this.formUsuario.patchValue({
    //           idLocal : this.usuarioEditar.idLocal
    //         })

    //     }
    //   },
    //   error: (e) => {
    //   },
    //   complete: () => {
    //   }
    // })

    if (sessionStorage.getItem('session')) {
      this.UsuarioLogueado = JSON.parse(sessionStorage.getItem('session')!) || '';
    }

  }

  ngOnInit(): void {
  
    if (this.usuarioEditar) {

      this.formUsuario.patchValue({
        nombreApellido: this.usuarioEditar.nombreApellidos,
        correo: this.usuarioEditar.correo,
        /*idRol: this.usuarioEditar.idRol,*/
        clave: this.usuarioEditar.clave
      })
    }

  }

  ngAfterViewInit() {
    
  }


  agregarEditarUsuario() {
 

    const _usuario: Usuario = {
      idUsuario: this.usuarioEditar == null ? 0 : this.usuarioEditar.idUsuario,
      nombreApellidos: this.formUsuario.value.nombreApellido,
      correo: this.formUsuario.value.correo,
      idRol: this.formUsuario.value.idRol,
      idLocal: this.UsuarioLogueado.idLocal,
      rolDescripcion : "",
      clave: this.formUsuario.value.clave,
      esActivo: this.formUsuario.value.esActivo,
      LocalDescripcion : "",
      idtipolocal:0,
      TipoLocal:""
    }

    
    if (this.usuarioEditar) {

      this._usuarioServicio.editUsuario(_usuario).subscribe({
        next: (data) => {

          if (data.status) {
            this.mostrarAlerta("El usuario fue editado", "Exito");
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

      this._usuarioServicio.saveUsuario(_usuario).subscribe({
        next: (data) => {

          if (data.status) {
            this.mostrarAlerta("El usuario fue registrado", "Exito");
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
