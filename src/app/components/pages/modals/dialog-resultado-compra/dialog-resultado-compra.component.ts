import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-dialog-resultado-compra',
  templateUrl: './dialog-resultado-compra.component.html',
  styleUrls: ['./dialog-resultado-compra.component.css']
})
export class DialogResultadoCompraComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
