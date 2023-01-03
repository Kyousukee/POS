import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Compra } from '../../../interfaces/compra';
import { DialogDetalleCompraComponent } from '../modals/dialog-detalle-compra/dialog-detalle-compra.component';
import { ComprasServiciosService } from '../../../servicios/compras-servicios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

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
  selector: 'app-historial-compra',
  templateUrl: './historial-compra.component.html',
  styleUrls: ['./historial-compra.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class HistorialCompraComponent implements OnInit {

  formGroup: FormGroup;
  buscarItem: any[] = [
    { value: "fecha", descripcion: "Por Fechas" },
    { value: "numero", descripcion: "Numero Venta" }
  ]

  ELEMENT_DATA: Compra[] = [];
  displayedColumns: string[] = ['numeroVenta', 'fechaRegistro', 'tipoPago', 'total', 'accion'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _compraServicio: ComprasServiciosService,
    private _snackBar: MatSnackBar,
  ) { 
    this.formGroup = this.fb.group({
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
  }

  ngOnInit(): void {
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

    console.log(this.formGroup.value.numero);
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

  verDetalle(_venta: Compra) {
    this.dialog.open(DialogDetalleCompraComponent, {
      data: _venta,
      disableClose: true,
      width: '700px',
    })
  }

}
