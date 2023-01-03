import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ProductosServiciosService } from 'src/app/servicios/productos-servicios.service';
import { PrecioProveedor } from '../../../../interfaces/precio-proveedor';

const ELEMENT_DATA: PrecioProveedor[] = [
  // { idProducto: 1, nombre: "yougur gloria", idCategoria: 1, descripcionCategoria:"Lacteos", stock: 30, precio: "2.5" },
  // { idProducto: 2, nombre: "Detergente sapolio", idCategoria: 2, descripcionCategoria:"Productos de Limpieza", stock: 23, precio: "3.5" },
  // { idProducto: 3, nombre: "Mantequilla lavie", idCategoria: 3, descripcionCategoria:"Abarrotes", stock: 25, precio: "4.5" },

];

@Component({
  selector: 'app-dialog-precios-proveedores',
  templateUrl: './dialog-precios-proveedores.component.html',
  styleUrls: ['./dialog-precios-proveedores.component.css']
})
export class DialogPreciosProveedoresComponent implements OnInit {

  displayedColumns: string[] = ['Proveedor','precio'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  nombreProducto:string = '';

  constructor(
    private _productoServicio: ProductosServiciosService,
    @Inject(MAT_DIALOG_DATA) public id_producto: number,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {

    this._productoServicio.getPrecioProveedores(this.id_producto).subscribe({
      next: (data) => {
        if (data.status){
          this.dataSource.data = data.value;
          this.nombreProducto = this.dataSource.data[0].nombreProducto;
        }else
          this._snackBar.open("No se encontraron datos", 'Oops!', { duration: 2000 });
      },
      error: (e) => {
      },
      complete: () => {

      }
    })

   }

  ngOnInit(): void {
  }


  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }

}
