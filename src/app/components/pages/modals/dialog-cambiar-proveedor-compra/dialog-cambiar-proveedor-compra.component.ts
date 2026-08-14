import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Proveedor } from 'src/app/interfaces/proveedor';
import { DialogDeleteProveedorComponent } from '../dialog-delete-proveedor/dialog-delete-proveedor.component';

@Component({
  selector: 'app-dialog-cambiar-proveedor-compra',
  templateUrl: './dialog-cambiar-proveedor-compra.component.html',
  styleUrls: ['./dialog-cambiar-proveedor-compra.component.css']
})
export class DialogCambiarProveedorCompraComponent implements OnInit {

  constructor(
    private dialogoReferencia: MatDialogRef<DialogDeleteProveedorComponent>
  ) { }

  ngOnInit(): void {
  }

  cambiarProveedor() {
    
      this.dialogoReferencia.close('cambiar')
    
  }
}
