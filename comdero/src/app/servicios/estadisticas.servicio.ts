import { Injectable } from "@angular/core";
import { HttpClient,HttpResponse, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from "./global";
import {AgenteServicio} from "./agente.servicio";
//import { Http, Headers } from "@angular/http";

interface objeto {
  data:JSON
}

@Injectable()

export class EstadisticasServicio {
  public url: String;


  constructor(public _http: HttpClient,public _agenteServicio:AgenteServicio) {
    this.url = GLOBAL.url;
  }

  getVentas(idTienda)
  {
    let headers = new HttpHeaders({ "Content-type": "application/json","Authorization": this._agenteServicio.getToken() });
    return this._http.get<objeto>(this.url + "getVentas/"+idTienda , { headers: headers });
  }

  getCalificaciones(idTienda)
  {
    let headers = new HttpHeaders({ "Content-type": "application/json","Authorization": this._agenteServicio.getToken() });
    return this._http.get<objeto>(this.url + "getCalificaciones/"+idTienda , { headers: headers });
  }

  getProductos(idTienda)
  {
    let headers = new HttpHeaders({ "Content-type": "application/json","Authorization": this._agenteServicio.getToken() });
    return this._http.get<objeto>(this.url + "getProductos/"+idTienda , { headers: headers });
  }



}
