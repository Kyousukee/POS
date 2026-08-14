import { Component, OnInit, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Usuario } from '../../../../interfaces/usuario';

@Component({
  selector: 'app-dialog-delete-usuario',
  templateUrl: './dialog-delete-usuario.component.html',
  styleUrls: ['./dialog-delete-usuario.component.css']
})
export class DialogDeleteUsuarioComponent implements OnInit {

  constructor(
    private dialogoReferencia: MatDialogRef<DialogDeleteUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public usuarioEliminar: Usuario
  ) {

  }

  ngOnInit(): void {
  }

   eliminarUsuario() {
     if (this.usuarioEliminar) {
      this.dialogoReferencia.close('eliminar')
     }
  }

}
