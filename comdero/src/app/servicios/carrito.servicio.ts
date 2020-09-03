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


  constructor(public _http: HttpClient, public _agenteServicio: AgenteServicio) {
    this.url = GLOBAL.url;
  }

  getCarrito() {

    let headers = new HttpHeaders({
      "Content-type": "application/json",
      "Authorization": this._agenteServicio.getToken()
    });
    return this._http.get<objeto>(this.url + "getCarrito", {headers: headers});

  }

  saveCarrito(Carrito_Producto) {

    let params = JSON.stringify(Carrito_Producto)
    let headers = new HttpHeaders({"Content-type": "application/json", "Authorization": this._agenteServicio.getToken()});
    return this._http.post<objeto>(this.url + "saveCarrito/", params, {headers: headers});
  }

}
