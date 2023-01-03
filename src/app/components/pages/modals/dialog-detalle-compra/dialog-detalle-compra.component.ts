import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DetalleCompra } from '../../../../interfaces/detalle-compra';
import { Compra } from '../../../../interfaces/compra';

@Component({
  selector: 'app-dialog-detalle-compra',
  templateUrl: './dialog-detalle-compra.component.html',
  styleUrls: ['./dialog-detalle-compra.component.css']
})
export class DialogDetalleCompraComponent implements OnInit {

  fechaRegistro?: string = "";
  numero?: string = "";
  tipoPago?: string = "";
  total?: string = "";
  detalleCompra: DetalleCompra[] = [
    {orden:0,idProducto:1,descripcionProducto:"",descripcionCobro:"",cantidad:0,precioTexto:"0",totalTexto:"0"},
  ]
  displayedColumns: string[] = ['producto', 'cantidad', 'precio', 'total'];

  constructor(@Inject(MAT_DIALOG_DATA) public _compra: Compra) {
    console.log(_compra);
    this.fechaRegistro = _compra.fechaRegistro;
    this.numero = _compra.numeroDocumento;
    this.tipoPago = _compra.tipoPago;
    this.total = _compra.total;
    this.detalleCompra = _compra.ListDetalleCompra == null ? [
      { orden:0,idProducto: 1, descripcionProducto: "",descripcionCobro:"", cantidad: 0, precioTexto: "0", totalTexto: "0" },
    ] : _compra.ListDetalleCompra;
   }

  ngOnInit(): void {
  }

}
