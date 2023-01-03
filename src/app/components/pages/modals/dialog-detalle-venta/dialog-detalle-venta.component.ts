import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponseDialogHistorial } from 'src/app/interfaces/responseDialogHistorial';
import { responseHistorial } from 'src/app/interfaces/responseHistorial';
import { responseHistorialDetalle } from 'src/app/interfaces/responseHistorialDetalle';
import { DetalleVenta } from '../../../../interfaces/detalle-venta';
import { Venta } from '../../../../interfaces/venta';
@Component({
  selector: 'app-dialog-detalle-venta',
  templateUrl: './dialog-detalle-venta.component.html',
  styleUrls: ['./dialog-detalle-venta.component.css']
})
export class DialogDetalleVentaComponent implements OnInit {


  fechaRegistro?: string = "";
  numero?: string = "";
  tipoPago?: string = "";
  total?: string = "";
  opt: string = "";
  proveedor?: string = "";
  conproveedor?: boolean = false;
  detalleVenta: responseHistorialDetalle[] = [
    {orden:0,idProducto:1,descripcionProducto:"",descripcionCobro:"",cantidad:0,precioTexto:"0",totalTexto:"0"},
  ]
  displayedColumns: string[] = ['producto', 'cantidad', 'precio', 'total'];
 

  constructor(@Inject(MAT_DIALOG_DATA) public response: ResponseDialogHistorial) {
    console.log(response);
    if (response.opcion?.toString() =='0') {
      this.opt = "Venta";
    }else{
      this.opt = "Compra";
    }
    this.fechaRegistro = response._venta!.fechaRegistro;
    this.numero = response._venta!.numeroDocumento;
    this.tipoPago = response._venta!.tipoPago;
    this.total = response._venta!.total;
    this.proveedor = response._venta!.desc_proveedor == '' ? 'Sin Proveedor..' : response._venta!.desc_proveedor;
    this.conproveedor = response._venta!.conProveedor;
    this.detalleVenta = response._venta!.listDetalle == null ? [
      { orden:0,idProducto: 1, descripcionProducto: "",descripcionCobro:"", cantidad: 0, precioTexto: "0", totalTexto: "0" },
    ] : response._venta!.listDetalle;

  }

  ngOnInit(): void {
    
  }

}
