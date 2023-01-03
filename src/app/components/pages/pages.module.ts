import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HistorialVentaComponent } from './historial/historial-venta.component';
import { HistorialCompraComponent } from './historial-compra--no se ocupa/historial-compra.component';
import { ProductosComponent } from './productos/productos.component';
import { StockProductosComponent } from './stock-productos/stock-productos.component';
import { ReportesComponent } from './reportes/reportes.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { VenderComponent } from './vender/vender.component';
import { ComprarComponent } from './comprar/comprar.component';
import { ReusableModule } from '../reusable/reusable.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { DialogDeleteUsuarioComponent } from './modals/dialog-delete-usuario/dialog-delete-usuario.component';
import { DialogUsuarioComponent } from './modals/dialog-usuario/dialog-usuario.component';
import { DialogDeleteProductoComponent } from './modals/dialog-delete-producto/dialog-delete-producto.component';
import { DialogProductoComponent } from './modals/dialog-producto/dialog-producto.component';
import { DialogResultadoVentaComponent } from './modals/dialog-resultado-venta/dialog-resultado-venta.component';
import { DialogResultadoCompraComponent } from './modals/dialog-resultado-compra/dialog-resultado-compra.component';
import { DialogDetalleVentaComponent } from './modals/dialog-detalle-venta/dialog-detalle-venta.component';
import { DialogDetalleCompraComponent } from './modals/dialog-detalle-compra/dialog-detalle-compra.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { DialogProveedorComponent } from './modals/dialog-proveedor/dialog-proveedor.component';
import { DialogDeleteProveedorComponent } from './modals/dialog-delete-proveedor/dialog-delete-proveedor.component';
import { DialogProveedorProductoComponent } from './modals/dialog-proveedor-producto/dialog-proveedor-producto.component';
import { DialogDeleteProveedorproductoComponent } from './modals/dialog-delete-proveedorproducto/dialog-delete-proveedorproducto.component';
import { DialogProveedorproductoInsertComponent } from './modals/dialog-proveedorproducto-insert/dialog-proveedorproducto-insert.component';
import { DialogCambiarProveedorCompraComponent } from './modals/dialog-cambiar-proveedor-compra/dialog-cambiar-proveedor-compra.component';
import { DialogPreciosProveedoresComponent } from './modals/dialog-precios-proveedores/dialog-precios-proveedores.component';
import { DialogPreciosHistorialComponent } from './modals/dialog-precios-historial/dialog-precios-historial.component';
import { ReportesCompraComponent } from './reportes-compra/reportes-compra.component';


@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    NavigationComponent,
    HistorialVentaComponent,
    HistorialCompraComponent,
    ProductosComponent,
    StockProductosComponent,
    ReportesComponent,
    UsuariosComponent,
    VenderComponent,
    ComprarComponent,
    DialogUsuarioComponent,
    DialogDeleteUsuarioComponent,
    DialogDeleteProductoComponent,
    DialogProductoComponent,
    DialogResultadoVentaComponent,
    DialogResultadoCompraComponent,
    DialogDetalleVentaComponent,
    DialogDetalleCompraComponent,
    ProveedorComponent,
    DialogProveedorComponent,
    DialogDeleteProveedorComponent,
    DialogProveedorProductoComponent,
    DialogDeleteProveedorproductoComponent,
    DialogProveedorproductoInsertComponent,
    DialogCambiarProveedorCompraComponent,
    DialogPreciosProveedoresComponent,
    DialogPreciosHistorialComponent,
    ReportesCompraComponent
  ],
  imports: [
    CommonModule,
    ReusableModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
