import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Venta } from '../../../interfaces/venta';
import { DialogDetalleVentaComponent } from '../modals/dialog-detalle-venta/dialog-detalle-venta.component';
import { VentasServiciosService } from '../../../servicios/ventas-servicios.service';
import { ComprasServiciosService } from '../../../servicios/compras-servicios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { responseHistorial } from 'src/app/interfaces/responseHistorial';
import { Usuario } from 'src/app/interfaces/usuario';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class HistorialVentaComponent implements OnInit {
  formGroup: FormGroup;
  buscarItem: any[] = [
    { value: "fecha", descripcion: "Por Fechas" },
    { value: "numero", descripcion: "Numero Venta" }
  ]

  movimientoItem: any[] = [
    { value: "0", descripcion: "Ventas" },
    { value: "1", descripcion: "Compras" }
  ]

  ELEMENT_DATA: responseHistorial[] = [];
  displayedColumns: string[] = ['numeroVenta', 'fechaRegistro', 'tipoPago', 'total', 'accion'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  UsuarioLogueado!: Usuario;
  localPrecioCompra:boolean = false;


  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _ventaServicio: VentasServiciosService,
    private _snackBar: MatSnackBar,
    private _compraServicio: ComprasServiciosService
  ) {
    this.formGroup = this.fb.group({
      buscarMovimiento:['0'],
      buscarPor: ['fecha'],
      numero:[''],
      fechaInicio: [''],
      fechaFin: ['']
    })

    this.formGroup.get('buscarPor')?.valueChanges.subscribe(value => {
      this.formGroup.patchValue({
        numero: "",
        fechaInicio: "",
        fechaFin: ""
      })
    })

    if (sessionStorage.getItem('session')) {
      this.UsuarioLogueado = JSON.parse(sessionStorage.getItem('session')!) || '';
    }
   }

  ngOnInit(): void {
    if (this.UsuarioLogueado.idtipolocal == 2) {
      this.localPrecioCompra = true;
      this.movimientoItem = [
        { value: "0", descripcion: "Ventas" }
      ]
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSubmitForm() {

    const _fechaInicio: any = moment(this.formGroup.value.fechaInicio).format('DD/MM/YYYY')
    const _fechaFin: any = moment(this.formGroup.value.fechaFin).format('DD/MM/YYYY')
    if (this.formGroup.value.buscarPor == 'fecha') {
      if (_fechaInicio === "Invalid date" || _fechaFin === "Invalid date") {
        this._snackBar.open("Debe ingresar ambas fechas", 'Oops!', { duration: 2000 });
        return;
      }
    }else if (this.formGroup.value.buscarPor == 'numero') {
      if (this.formGroup.value.numero == '') {
        this._snackBar.open("Debe ingresar numero de documento", 'Oops!', { duration: 2000 });
        return;
      }
    }

    if (this.formGroup.value.buscarMovimiento ==0) {
      this._ventaServicio.historal(
        this.formGroup.value.buscarPor,
        this.formGroup.value.numero,
        _fechaInicio,
        _fechaFin,
      ).subscribe({
        next: (data) => {
  
          if (data.status) {
  
            this.dataSource.data = data.value;
  
          }
          else
            this._snackBar.open("No se encontraron datos", 'Oops!', { duration: 2000 });
        },
        error: (e) => {
        },
        complete: () => {
  
        }
      })
    }else{
      this._compraServicio.historal(
        this.formGroup.value.buscarPor,
        this.formGroup.value.numero,
        _fechaInicio,
        _fechaFin,
      ).subscribe({
        next: (data) => {
  
          if (data.status) {
  
            this.dataSource.data = data.value;
  
          }
          else
            this._snackBar.open("No se encontraron datos", 'Oops!', { duration: 2000 });
        },
        error: (e) => {
        },
        complete: () => {
  
        }
      })
    }

    this.formGroup = this.fb.group({
      buscarMovimiento:[this.formGroup.value.buscarMovimiento],
      buscarPor: ['fecha'],
      numero:[''],
      fechaInicio: [''],
      fechaFin: ['']
    })

    

  }

  verDetalle(_venta: responseHistorial) {
    const opcion:string = this.formGroup.value.buscarMovimiento;
    console.log(this.formGroup.value.buscarMovimiento);
    this.dialog.open(DialogDetalleVentaComponent, {
      data: {_venta,opcion},
      disableClose: true,
      width: '700px',
    })
  }

}
