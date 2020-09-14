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

export class CompraServicio {
  public url: String;


  constructor(public _http: HttpClient, public _agenteServicio: AgenteServicio) {
    this.url = GLOBAL.url;
  }


  saveComprarProducto(informacionCompra) {

    let params = JSON.stringify(informacionCompra)
    let headers = new HttpHeaders({
      "Content-type": "application/json",
      "Authorization": this._agenteServicio.getToken()
    });
    return this._http.post<objeto>(this.url + "saveComprarProducto/", params, {headers: headers});
  }

  saveComprarProductoCarrito(informacionCompra) {
    let params = JSON.stringify(informacionCompra)
    let headers = new HttpHeaders({
      "Content-type": "application/json",
      "Authorization": this._agenteServicio.getToken()
    });
    return this._http.post<objeto>(this.url + "saveComprarProductoCarrito/", params, {headers: headers});
  }

  getMisCompras() {
    let headers = new HttpHeaders({
      "Content-type": "application/json",
      "Authorization": this._agenteServicio.getToken()
    });
    return this._http.get<objeto>(this.url + "getMisCompras", {headers: headers});
  }


}
