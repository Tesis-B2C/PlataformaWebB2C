import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TiendaServicio} from "../../servicios/tienda.servicio";

@Component({
  selector: 'app-busqueda-categoria',
  templateUrl: './busqueda-categoria.component.html',
  styleUrls: ['./busqueda-categoria.component.css']
})
export class BusquedaCategoriaComponent implements OnInit {

  constructor(public _tiendaServicio:TiendaServicio, public route: ActivatedRoute) { }

  public categoria
  async ngOnInit() {
    this.route.params.subscribe(params => {
     this.categoria=params.categoria;
     this.buscarPorCategoria();
    });
  }

  public async buscarPorCategoria(){
    let response = await this._tiendaServicio.obtenerFiltroBusquedaTodosCategoria(this.categoria).toPromise()
    console.log(" por categorias",response.data)
  }

}
