import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { Usuario } from '../../../interfaces/usuario';

export interface MenuItem {
  link: string;
  icon: string;
  label: string;
}

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NavigationComponent {

  UsuarioLogueado!: Usuario;
  PermisoDashboard: boolean = true;
  PermisoUsuarios: boolean = true;
  PermisoProductos: boolean = true;
  PermisoComprar: boolean = true;
  PermisoVender: boolean = true;
  PermisoHistorial: boolean = true;
  PermisoReportes: boolean = true;
  PermisoReportesCompra: boolean = true;

  /** Pantallas angostas: el menú lateral pasa a modo overlay. */
  isHandset$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 959.98px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  /** Rango en el que la barra lateral queda compacta (sólo iconos). */
  isRail$: Observable<boolean> = this.breakpointObserver.observe('(min-width: 960px) and (max-width: 1279.98px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {
    //console.log(sessionStorage.getItem('session'));
    if (sessionStorage.getItem('session')) {
      this.UsuarioLogueado = JSON.parse(sessionStorage.getItem('session')!) || '';
      if (this.UsuarioLogueado.idRol == 2) {
        if (this.UsuarioLogueado.idtipolocal==2) {
          this.PermisoProductos = false;
          this.PermisoDashboard = false;
          this.PermisoVender = false;
          this.PermisoReportes = false;
          this.PermisoUsuarios = false;
          this.PermisoHistorial = false;
        }else{
          this.PermisoDashboard = false;
          this.PermisoUsuarios = false;
          this.PermisoProductos = false;
          this.PermisoComprar = false;
          this.PermisoVender = false;
          this.PermisoHistorial = false;
          this.PermisoReportes = false;
          this.PermisoReportesCompra = false;
        }

      }else if (this.UsuarioLogueado.idRol == 3) {
        if (this.UsuarioLogueado.idtipolocal==2) {
          this.PermisoProductos = false;
          this.PermisoDashboard = false;
          this.PermisoVender = false;
          this.PermisoReportes = false;
          this.PermisoUsuarios = false;
          this.PermisoHistorial = false;
        }else{
          this.PermisoProductos = false;
          this.PermisoDashboard = false;
          this.PermisoVender = false;
          this.PermisoReportes = false;
          this.PermisoReportesCompra = false;
        }

      }else if (this.UsuarioLogueado.idRol == 1) {
        if (this.UsuarioLogueado.idtipolocal==2) {
          this.PermisoProductos = false;
          this.PermisoDashboard = false;
          this.PermisoVender = false;
          this.PermisoReportes = false;
          this.PermisoUsuarios = false;
          this.PermisoHistorial = false;
        }else{
          this.PermisoDashboard = false;
          this.PermisoUsuarios = false;
          this.PermisoProductos = false;
          this.PermisoComprar = false;
          this.PermisoVender = false;
          this.PermisoHistorial = false;
          this.PermisoReportes = false;
          this.PermisoReportesCompra = false;
        }

      }


    }
   }

  /** Items visibles del menú según los permisos calculados arriba. */
  get menuItems(): MenuItem[] {
    const items: { item: MenuItem, oculto: boolean }[] = [
      { item: { link: '/pages/dashboard', icon: 'dashboard', label: 'Dashboard' }, oculto: this.PermisoDashboard },
      { item: { link: '/pages/usuarios', icon: 'group', label: 'Usuarios' }, oculto: this.PermisoUsuarios },
      { item: { link: '/pages/productos', icon: 'collections_bookmark', label: 'Productos' }, oculto: this.PermisoProductos },
      { item: { link: '/pages/proveedor', icon: 'contacts', label: 'Proveedores' }, oculto: this.PermisoComprar },
      { item: { link: '/pages/comprar', icon: 'currency_exchange', label: 'Comprar' }, oculto: this.PermisoComprar },
      { item: { link: '/pages/vender', icon: 'monetization_on', label: 'Vender' }, oculto: this.PermisoVender },
      { item: { link: '/pages/historial', icon: 'edit_note', label: 'Historial' }, oculto: this.PermisoHistorial },
      { item: { link: '/pages/reportes', icon: 'sell', label: 'Reportes Ventas' }, oculto: this.PermisoReportes },
      { item: { link: '/pages/reportescompras', icon: 'local_mall', label: 'Reportes Compras' }, oculto: this.PermisoReportesCompra },
    ];
    return items.filter(i => !i.oculto).map(i => i.item);
  }

  get iniciales(): string {
    const nombre = this.UsuarioLogueado?.nombreApellidos ?? '';
    return nombre.split(' ').filter(p => p).slice(0, 2).map(p => p[0].toUpperCase()).join('');
  }

  /** En móvil el menú es overlay: se cierra al navegar. */
  alNavegar(snav: MatSidenav) {
    if (snav.mode === 'over') {
      snav.close();
    }
  }

  cerrarSesion() {
    sessionStorage.removeItem('session');
 }

 shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(window.location.host);
}
