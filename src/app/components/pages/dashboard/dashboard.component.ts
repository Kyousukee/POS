import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Chart, registerables,Colors } from 'node_modules/chart.js';
import { DashboardServiciosService } from '../../../servicios/dashboard-servicios.service';
Chart.register(...registerables,Colors);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalIngresos: number = 0;
  totalVentas: string = "0";
  totalProductos: string = "0";

  @ViewChild('myChart') myChart: ElementRef | undefined;
  @ViewChild('myChart2') myChart2: ElementRef | undefined;
  @ViewChild('myChart3') myChart3: ElementRef | undefined;

  constructor(
    private _dashboardServicio: DashboardServiciosService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this._dashboardServicio.resumen().subscribe({
      next: (data) => {
        // console.log(data.value.totalIngresos);
        if (data.status) {
          this.totalIngresos = Number(data.value.totalIngresos.replace(',', '.'));
          this.totalVentas = data.value.totalVentas;
          this.totalProductos = data.value.totalProductos;

          const arrayData: any[] = data.value.ventasUltimaSemana;

          const arrayDataProducto: any[] = data.value.productosUltimaSemana;

          const arrayDataProductoCantidad: any[] = data.value.productoscantidadUltimaSemana;

          const labelTemp = arrayData.map((value) => value.Fecha);
          const dataTemp = arrayData.map((value) => value.Total);
          this.mostrarGraficoVentas(labelTemp, dataTemp)

          const labelTempPro = arrayDataProducto.map((value) => value.nombre);
          const dataTempPro = arrayDataProducto.map((value) => value.Total);
          this.mostrarGraficoProducto(labelTempPro, dataTempPro)

          const labelTempPro2 = arrayDataProductoCantidad.map((value) => value.nombre);
          const dataTempPro2 = arrayDataProductoCantidad.map((value) => value.Total);
          this.mostrarGraficoProductoCantidad(labelTempPro2, dataTempPro2)

        }
      },
      error: (e) => { },
      complete: () => { }
    })
  }

  mostrarGraficoVentas(labelsGrafico:any[],dataGrafico:any[]) {
    
    const myChart = new Chart(this.myChart!.nativeElement.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labelsGrafico,
        datasets: [{
          label: '# de Ventas',
          data: dataGrafico,
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins:{
          title:{
            display: true,
            text: 'Ventas Diarias'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  mostrarGraficoProducto(labelsGrafico:any[],dataGrafico:any[]) {
    
    const myChart = new Chart(this.myChart2!.nativeElement.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: labelsGrafico,
        datasets: [{
          label: 'Total en Ventas',
          data: dataGrafico,
          
          
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins:{
          title:{
            display: true,
            text: 'Productos con mas Ventas en la semana'
          }
        }
        // scales: {
        //   y: {
        //     beginAtZero: true
        //   }
        // }
      }
    });
  }

  mostrarGraficoProductoCantidad(labelsGrafico:any[],dataGrafico:any[]) {
  
    const myChart = new Chart(this.myChart3!.nativeElement.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labelsGrafico,
        datasets: [{
          label: 'Cantidad ',
          data: dataGrafico,
          
          
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        maintainAspectRatio: false,
        responsive: true,
        plugins:{
          title:{
            display: true,
            text: 'Cantidad de Productos con mas Ventas en la semana'
          }
        }
        // scales: {
        //   y: {
        //     beginAtZero: true
        //   }
        // }
      }
    });
  }

}
