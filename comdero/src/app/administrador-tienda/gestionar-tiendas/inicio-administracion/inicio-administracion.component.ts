import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-inicio-administracion',
  templateUrl: './inicio-administracion.component.html',
  styleUrls: ['./inicio-administracion.component.css']
})
export class InicioAdministracionComponent implements OnInit {
  public identidadTienda;

  constructor() {
  }

  ngOnInit() {
    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));
    console.log(this.identidadTienda,"tienda identity")
  }

}
