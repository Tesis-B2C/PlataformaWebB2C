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
    let headers = new HttpHeaders({
      "Content-type": "application/json",
      "Authorization": this._agenteServicio.getToken()
    });
    return this._http.post<objeto>(this.url + "saveCarrito/", params, {headers: headers});
  }

  updateCantidadProducto(num_variante, id_carrito, cantidad) {
    let obj={
      id_carrito:id_carrito,
      cantidad:cantidad
    }
    let params = JSON.stringify(obj);
    let headers = new HttpHeaders({
      "Content-type": "application/json",
      "Authorization": this._agenteServicio.getToken()
    });
    return this._http.put<objeto>(this.url + "updateCantidadProducto/" + num_variante,params, {headers: headers});
  }
  deleteProductoCarrito(variante) {

    let headers = new HttpHeaders({
      "Content-type": "application/json",
      "Authorization": this._agenteServicio.getToken()
    });
    return this._http.delete<objeto>(this.url + "deleteProductoCarrito/" + variante, {headers: headers});
  }



}
