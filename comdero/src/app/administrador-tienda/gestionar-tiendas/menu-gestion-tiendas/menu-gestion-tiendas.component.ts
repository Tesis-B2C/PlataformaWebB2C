import {Component} from '@angular/core';

@Component({
  selector: 'app-menu-gestion-tiendas',
  templateUrl: './menu-gestion-tiendas.component.html',
  styleUrls: ['./menu-gestion-tiendas.component.css']
})
export class MenuGestionTiendasComponent {
public banderaSideBar:boolean=false;
  constructor() {
  }
  abrirSideBar(){
    this.banderaSideBar=!this.banderaSideBar;
  }

}
