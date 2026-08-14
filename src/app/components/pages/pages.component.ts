import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from '../../interfaces/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {
  constructor(private router: Router,) { 
    
  }

  ngOnInit(): void {
    if (!sessionStorage.getItem('session')) {
      this.router.navigate(['login'])
    }else{
      this.router.navigate(['pages/dashboard'])
    }
    
  }

}
