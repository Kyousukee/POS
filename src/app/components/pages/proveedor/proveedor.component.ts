import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Proveedor } from 'src/app/interfaces/proveedor';
import { ProveedorServiciosService } from 'src/app/servicios/proveedor-servicios.service';
import { DialogDeleteProveedorComponent } from '../modals/dialog-delete-proveedor/dialog-delete-proveedor.component';
import { DialogProveedorComponent } from '../modals/dialog-proveedor/dialog-proveedor.component';
import { DialogProveedorProductoComponent } from '../modals/dialog-proveedor-producto/dialog-proveedor-producto.component';

const ELEMENT_DATA: Proveedor[] = [
  // { idProducto: 1, nombre: "yougur gloria", idCategoria: 1, descripcionCategoria:"Lacteos", stock: 30, precio: "2.5" },
  // { idProducto: 2, nombre: "Detergente sapolio", idCategoria: 2, descripcionCategoria:"Productos de Limpieza", stock: 23, precio: "3.5" },
  // { idProducto: 3, nombre: "Mantequilla lavie", idCategoria: 3, descripcionCategoria:"Abarrotes", stock: 25, precio: "4.5" },

];

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {

  displayedColumns: string[] = ['Rut_Proveedor', 'Descripcion', 'Estado','Productos', 'acciones'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _proveedorServicio: ProveedorServiciosService
  ) { }

  ngOnInit(): void {
    this.mostrarProveedor();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  mostrarProveedor() {
    this._proveedorServicio.getProveedores().subscribe({
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

  agregarProducto() {
    this.dialog.open(DialogProveedorComponent, {
      disableClose: false
    }).afterClosed().subscribe(result => {
      if (result === "agregado") {
        this.mostrarProveedor();
      }
    });
  }

  editarProducto(proveedor: Proveedor) {
    this.dialog.open(DialogProveedorComponent, {
      disableClose: false,
      data: proveedor
    }).afterClosed().subscribe(result => {

      if (result === "editado")
        this.mostrarProveedor();

    });
  }

  verProductos(proveedor: Proveedor) {
    this.dialog.open(DialogProveedorProductoComponent, {
      disableClose: false,
      data: proveedor.id_proveedor,
      width:'750px',
      height:'400px'
    }).afterClosed().subscribe(result => {

      if (result === "editado")
        this.mostrarProveedor();

    });
  }

  eliminarProducto(proveedor: Proveedor) {
    this.dialog.open(DialogDeleteProveedorComponent, {
      disableClose: true,
      data: proveedor
    }).afterClosed().subscribe(result => {

      if (result === "eliminar") {

        this._proveedorServicio.delete(proveedor.id_proveedor).subscribe({
          next: (data) => {

            if (data.status) {
              this.mostrarAlerta("El Proveedor fue eliminado", "Listo!")
              this.mostrarProveedor();
            } else {
              this.mostrarAlerta("No se pudo eliminar el proveedor", "Error");
            }

          },
          error: (e) => {
          },
          complete: () => {
          }
        })

      }


    
    });
  }

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }
  
}
