import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { PrecioHistorial } from 'src/app/interfaces/precio-historial';
import { RequestHistorialPrecio } from 'src/app/interfaces/request-historial-precio';
import { ProveedorServiciosService } from 'src/app/servicios/proveedor-servicios.service';

const ELEMENT_DATA: PrecioHistorial[] = [
  // { idProducto: 1, nombre: "yougur gloria", idCategoria: 1, descripcionCategoria:"Lacteos", stock: 30, precio: "2.5" },
  // { idProducto: 2, nombre: "Detergente sapolio", idCategoria: 2, descripcionCategoria:"Productos de Limpieza", stock: 23, precio: "3.5" },
  // { idProducto: 3, nombre: "Mantequilla lavie", idCategoria: 3, descripcionCategoria:"Abarrotes", stock: 25, precio: "4.5" },

];

@Component({
  selector: 'app-dialog-precios-historial',
  templateUrl: './dialog-precios-historial.component.html',
  styleUrls: ['./dialog-precios-historial.component.css']
})
export class DialogPreciosHistorialComponent implements OnInit {

  displayedColumns: string[] = ['precio','fechaModificacion'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(
    private _proveedorServicio: ProveedorServiciosService,
    @Inject(MAT_DIALOG_DATA) public idpropre: number,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.mostrarPrecioHistorial();
  }

  mostrarPrecioHistorial() {
    this._proveedorServicio.GetPrecioHistorial(this.idpropre).subscribe({
      next: (data) => {
        if (data.status)
          this.dataSource.data = data.value;
        else
          this._snackBar.open("No se encontraron datos", 'Oops!', { duration: 2000 });
      },
      error: (e) => {
      },
      complete: () => {

      }
    })
  }

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }

}
