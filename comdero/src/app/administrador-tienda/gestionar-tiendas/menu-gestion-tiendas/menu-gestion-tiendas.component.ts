import {Component} from '@angular/core';
import {Router} from '@angular/router';
@Component({
  selector: 'app-menu-gestion-tiendas',
  templateUrl: './menu-gestion-tiendas.component.html',
  styleUrls: ['./menu-gestion-tiendas.component.css']
})
export class MenuGestionTiendasComponent {
public banderaSideBar:boolean=false;
  constructor(private router: Router) {
  }
  abrirSideBar(){
    this.banderaSideBar=!this.banderaSideBar;
  }


}
