import {AfterContentInit, Component, OnInit} from '@angular/core';
import {AgenteServicio} from "../../servicios/agente.servicio";
import {TiendaServicio} from "../../servicios/tienda.servicio";
import { GLOBAL } from "../../servicios/global";
@Component({
  selector: 'app-tiendas',
  templateUrl: './tiendas.component.html',
  styleUrls: ['./tiendas.component.css']
})
export class TiendasComponent implements OnInit, AfterContentInit {
  public banderMensaje: boolean = false;
 public misTiendas:any;
 public url=GLOBAL.url;
  constructor(private _agenteServicio:AgenteServicio, private _tiendaServicio:TiendaServicio  ) {

  }

  async ngOnInit() {
    let identidad = this._agenteServicio.getIdentity();
    let response= await this._tiendaServicio.getMisTiendas(identidad.COD_AGENTE).toPromise();
    this.misTiendas=response.data;
    console.log("tiendas",this.misTiendas)
  }

  ngAfterContentInit(): void {
    this.banderMensaje = true;
  }



}
