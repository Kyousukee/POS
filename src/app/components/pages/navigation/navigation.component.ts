import { BreakpointObserver,Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Usuario } from '../../../interfaces/usuario';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
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



  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
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

  cerrarSesion() {
    sessionStorage.removeItem('session');
 }

 onmouse(){
  console.log('Si funciona');
 }

 shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(window.location.host);
}
