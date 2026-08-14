import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Proveedorproducto } from '../../../../interfaces/proveedorproducto';

@Component({
  selector: 'app-dialog-delete-proveedorproducto',
  templateUrl: './dialog-delete-proveedorproducto.component.html',
  styleUrls: ['./dialog-delete-proveedorproducto.component.css']
})
export class DialogDeleteProveedorproductoComponent implements OnInit {

  constructor(
    private dialogoReferencia: MatDialogRef<DialogDeleteProveedorproductoComponent>,
    @Inject(MAT_DIALOG_DATA) public proveedorproductoEliminar: Proveedorproducto
  ) { }

  ngOnInit(): void {
  }

  eliminarProveedorProducto() {
    if (this.proveedorproductoEliminar) {
      this.dialogoReferencia.close('eliminar')
    }
  }

}
