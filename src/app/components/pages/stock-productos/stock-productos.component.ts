import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-stock-productos',
    templateUrl: './stock-productos.component.html',
    styleUrls: ['./stock-productos.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class StockProductosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
