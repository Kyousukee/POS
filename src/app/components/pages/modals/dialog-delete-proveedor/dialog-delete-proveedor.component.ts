import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Proveedor } from '../../../../interfaces/proveedor';

@Component({
    selector: 'app-dialog-delete-proveedor',
    templateUrl: './dialog-delete-proveedor.component.html',
    styleUrls: ['./dialog-delete-proveedor.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DialogDeleteProveedorComponent implements OnInit {

  constructor(
    private dialogoReferencia: MatDialogRef<DialogDeleteProveedorComponent>,
    @Inject(MAT_DIALOG_DATA) public proveedorEliminar: Proveedor
  ) { }

  ngOnInit(): void {
  }

  eliminarProveedor() {
    if (this.proveedorEliminar) {
      this.dialogoReferencia.close('eliminar')
    }
  }

}
