import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HistorialVentaComponent } from './historial/historial-venta.component';
import { PagesComponent } from './pages.component';
import { ProductosComponent } from './productos/productos.component';
import { ReportesComponent } from './reportes/reportes.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { VenderComponent } from './vender/vender.component';
import { HistorialCompraComponent } from './historial-compra--no se ocupa/historial-compra.component';
import { ComprarComponent } from './comprar/comprar.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { ReportesCompraComponent } from './reportes-compra/reportes-compra.component';

const routes: Routes = [
  {
    path: '', component: PagesComponent, children: [
      {path:'dashboard',component:DashboardComponent},
      {path:'usuarios',component:UsuariosComponent},
      {path:'productos',component:ProductosComponent},
      {path:'proveedor',component:ProveedorComponent},
      {path:'vender',component:VenderComponent},
      {path:'comprar',component:ComprarComponent},
      {path:'historial',component:HistorialVentaComponent},
      // {path:'historialcompras',component:HistorialCompraComponent},
      {path:'reportes',component:ReportesComponent},
      {path:'reportescompras',component:ReportesCompraComponent}
    ]
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
