import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import {GLOBAL} from "./global";
import {AgenteServicio} from "./agente.servicio";

//import { Http, Headers } from "@angular/http";

interface objeto {
  data: JSON,
  message: JSON
}

@Injectable()

export class CarritoServicio {
  public url: String;


  constructor(private _http: HttpClient,private _agenteServicio: AgenteServicio) {
    this.url = GLOBAL.url;
  }

  getCarrito(Id_Agente) {
    debugger;
    let headers = new HttpHeaders({"Content-type": "application/json","Authorization": this._agenteServicio.getToken()});
    return this._http.get<objeto>(this.url + "getCarrito/" + Id_Agente, {headers: headers});

  }

  saveCarrito(Id_Agente, producto) {
    let params = JSON.stringify(producto)
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.post<objeto>(this.url + "saveCarrito/" + Id_Agente, params,{headers: headers});
  }

}
