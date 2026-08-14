import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Reporte } from 'src/app/interfaces/reporte';
import { ReportesServiciosService } from 'src/app/servicios/reportes-servicios.service';
import * as XLSX from 'xlsx';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-reportes-compra',
  templateUrl: './reportes-compra.component.html',
  styleUrls: ['./reportes-compra.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class ReportesCompraComponent implements OnInit {

  formGroup: FormGroup;
 

  __buscarPo: string = '0';
  ELEMENT_DATA: Reporte[] = [];
  displayedColumns: string[] = ['fechaRegistro','numeroVenta',  'tipoPago', 'total', 'producto','cantidad','precio','netoProducto','ivaProducto','totalProducto','proveedor'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private _reportesServicio: ReportesServiciosService,
    private _snackBar: MatSnackBar,
  ) {
    this.formGroup = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    })
   }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  onSubmitForm() {

    const _fechaInicio: any = moment(this.formGroup.value.fechaInicio).format('YYYY/MM/DD')
    const _fechaFin: any = moment(this.formGroup.value.fechaFin).format('YYYY/MM/DD')
    if (_fechaInicio === "Invalid date" || _fechaFin === "Invalid date") {
      this._snackBar.open("Debe ingresar ambas fechas", 'Oops!', { duration: 2000 });
      return;
    }

    this._reportesServicio.reporte(
      "1",
      _fechaInicio,
      _fechaFin,
    ).subscribe({
      next: (data) => {

        if (data.status) {
          console.log(data.value);
          this.ELEMENT_DATA = data.value;
          this.dataSource.data = data.value;
          console.log(this.ELEMENT_DATA);
        }
        else {
          this.ELEMENT_DATA = [];
          this.dataSource.data = [];
          this._snackBar.open("No se encontraron datos", 'Oops!', { duration: 2000 });
        }
          
      },
      error: (e) => {
      },
      complete: () => {

      }
    })

  }

  exportarExcel() {


    let Heading = [['Numero Venta',  'Tipo Pago','Fecha Registro', 'Total', 'Producto','Cantidad','Precio','Precio Neto','Precio IVA','Precio Total','Proveedor']];

    //Had to create a new workbook and then add the header
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);

    XLSX.utils.sheet_add_aoa(ws, Heading);

    //Starting in the second row to avoid overriding and skipping headers
    XLSX.utils.sheet_add_json(ws, this.ELEMENT_DATA, { origin: 'A2', skipHeader: true });

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    this.fixWidth(ws);
    XLSX.writeFile(wb, 'Reporte Compras.xlsx');
    // const wb = XLSX.utils.book_new();
    // const ws = XLSX.utils.json_to_sheet(this.ELEMENT_DATA);

    // XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    // XLSX.writeFile(wb, "Reporte Ventas.xlsx")
  }

  private fixWidth(worksheet: XLSX.WorkSheet) {
    const data = XLSX.utils.sheet_to_json<any>(worksheet)
    const colLengths = Object.keys(data[0]).map((k) => k.toString().length)
    for (const d of data) {
      Object.values(d).forEach((element: any, index) => {
        const length = element.toString().length
        if (colLengths[index] < length) {
          colLengths[index] = length
        }
      })
    }
    worksheet["!cols"] = colLengths.map((l) => {
      return {
        wch: l,
      }
    })
  }

  buscarPor() {
    this.__buscarPo = this.formGroup.value.buscarPor;
  }


}
