import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-resultado-venta',
    templateUrl: './dialog-resultado-venta.component.html',
    styleUrls: ['./dialog-resultado-venta.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DialogResultadoVentaComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
