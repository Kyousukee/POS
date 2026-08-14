import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Producto } from 'src/app/interfaces/producto';
import { Proveedorproducto } from 'src/app/interfaces/proveedorproducto';
import { ProveedorproductoRequest } from 'src/app/interfaces/proveedorproducto-request';
import { Usuario } from 'src/app/interfaces/usuario';
import { ProductosServiciosService } from 'src/app/servicios/productos-servicios.service';
import { ProveedorServiciosService } from 'src/app/servicios/proveedor-servicios.service';
import { DialogDeleteProveedorproductoComponent } from '../dialog-delete-proveedorproducto/dialog-delete-proveedorproducto.component';
import { DialogProductoComponent } from '../dialog-producto/dialog-producto.component';
import { DialogProveedorproductoInsertComponent } from '../dialog-proveedorproducto-insert/dialog-proveedorproducto-insert.component';
import { DialogPreciosHistorialComponent } from '../dialog-precios-historial/dialog-precios-historial.component';

const ELEMENT_DATA: Proveedorproducto[] = [
  // { idProducto: 1, nombre: "yougur gloria", idCategoria: 1, descripcionCategoria:"Lacteos", stock: 30, precio: "2.5" },
  // { idProducto: 2, nombre: "Detergente sapolio", idCategoria: 2, descripcionCategoria:"Productos de Limpieza", stock: 23, precio: "3.5" },
  // { idProducto: 3, nombre: "Mantequilla lavie", idCategoria: 3, descripcionCategoria:"Abarrotes", stock: 25, precio: "4.5" },

];

@Component({
  selector: 'app-dialog-proveedor-producto',
  templateUrl: './dialog-proveedor-producto.component.html',
  styleUrls: ['./dialog-proveedor-producto.component.css']
})
export class DialogProveedorProductoComponent implements OnInit {

  options: Producto[] = [];
  
  deshabilitado: boolean = false;

  cobroPor:number = 1;

  filteredOptions!: Producto[];
  agregarProducto!: Producto;
  agregarProductoP!: ProveedorproductoRequest;


  tipodePago: string = "Efectivo";
  totalPagar: number = 0;
  
  // formGroup: FormGroup;
  displayedColumns: string[] = ['producto','precio','Estado','precioHistorial','accion'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  orden:number = 0;
  UsuarioLogueado!: Usuario;
  
  constructor(
    private dialogoReferencia: MatDialogRef<DialogProductoComponent>,
    private fb: FormBuilder,
    private _proveedorServicio: ProveedorServiciosService,
    private _productoServicio: ProductosServiciosService,
    @Inject(MAT_DIALOG_DATA) public id_proveedor: number,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar) 
    { 

      // this.formGroup = this.fb.group({
      //   producto: ['', Validators.required],
      //   precio: ['', Validators.required],
      //   codbarras: [''],
      //   esActivo:[Validators.required],
      //   editar:['0']
      // })

      // this.formGroup.get('producto')?.valueChanges.subscribe(value => {
      //   this.filteredOptions =  this._filter(value)
      // })

      this._productoServicio.getProductos().subscribe({
        next: (data) => {
          if (data.status)
            this.options = data.value;
        },
        error: (e) => {
        },
        complete: () => {
  
        }
      })
  
      if (sessionStorage.getItem('session')) {
        this.UsuarioLogueado = JSON.parse(sessionStorage.getItem('session')!) || '';
      }
      
      this.agregarProductoP ={ id: id_proveedor};
      console.log(this.agregarProductoP);
    }

  ngOnInit(): void {
    this.mostrarProveedorProducto();
    this.mostrarProductos();
  }

  agregarProductoProveedor() {
    this.dialog.open(DialogProveedorproductoInsertComponent, {
      disableClose: false,
      data: this.agregarProductoP
    }).afterClosed().subscribe(result => {
      if (result === "agregado") {
        this.mostrarProveedorProducto();
      }
    });
  }

  editarProducto(proveedorproducto: Proveedorproducto) {
    this.dialog.open(DialogProveedorproductoInsertComponent, {
      disableClose: false,
      data: {
        id: this.id_proveedor,
        proveedorProductoEditar: proveedorproducto
      }
    }).afterClosed().subscribe(result => {

      if (result === "editado")
        this.mostrarProveedorProducto();

    });
  }

  mostrarProductos(){
    this._productoServicio.getProductos().subscribe({
      next: (data) => {
        if (data.status)
          this.options = data.value;
      },
      error: (e) => {
      },
      complete: () => {

      }
    })

    console.log(this.options);
    
  }

  private _filter(value: any): Producto[] {
    const filterValue = typeof value === "string" ? value.toLowerCase() : value.nombre.toLowerCase();
    return this.options.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  displayProducto(producto: Producto): string {
    return producto.nombre;
  }

  mostrarProveedorProducto() {
    this._proveedorServicio.getProveedoresProductos(this.id_proveedor).subscribe({
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

  productoSeleccionado(event: any) {
    console.log(event.option.value);
    this.agregarProducto = event.option.value;
    
    this.cobroPor = this.agregarProducto.id_cob;
  }

  eliminarProveedorProducto(proveedorProducto: Proveedorproducto) {
    this.dialog.open(DialogDeleteProveedorproductoComponent, {
      disableClose: true,
      data: proveedorProducto
    }).afterClosed().subscribe(result => {

      if (result === "eliminar") {

        this._proveedorServicio.deleteproducto(proveedorProducto.id_proPre).subscribe({
          next: (data) => {

            if (data.status) {
              this.mostrarAlerta("El Producto fue eliminado", "Listo!")
              
            } else {
              this.mostrarAlerta("No se pudo eliminar el Producto", "Error");
            }

          },
          error: (e) => {
          },
          complete: () => {
          }
        })

      }


    
    });

    this.mostrarProveedorProducto();
  }

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }

  verPrecioHistorial(proveedorproducto: Proveedorproducto) {
    this.dialog.open(DialogPreciosHistorialComponent, {
      disableClose: false,
      data: proveedorproducto.id_proPre,
      width: '400px'
    }).afterClosed().subscribe(result => {

      if (result === "editado")
        this.mostrarProveedorProducto();

    });
  }

}
