import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockProductosComponent } from './stock-productos.component';

describe('StockProductosComponent', () => {
  let component: StockProductosComponent;
  let fixture: ComponentFixture<StockProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockProductosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
