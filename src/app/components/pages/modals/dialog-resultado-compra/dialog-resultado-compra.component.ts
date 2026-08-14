import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-resultado-compra',
    templateUrl: './dialog-resultado-compra.component.html',
    styleUrls: ['./dialog-resultado-compra.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DialogResultadoCompraComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
