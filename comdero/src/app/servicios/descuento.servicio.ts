import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import {GLOBAL} from "./global";
import {AgenteServicio} from "./agente.servicio";

//import { Http, Headers } from "@angular/http";

interface objeto {
  data: JSON,
  message: JSON,
}


@Injectable()

export class DescuentoServicio {
  public url: String;


  constructor(public _http: HttpClient, public _agenteServicio:AgenteServicio) {
    this.url = GLOBAL.url;
  }

  saveDescuento(Id_Tienda,objDescuento) {
    let params = JSON.stringify(objDescuento);
    let headers = new HttpHeaders({"Content-type": "application/json","Authorization": this._agenteServicio.getToken()});
    return this._http.post<objeto>(this.url + "saveDescuento/"+Id_Tienda, params, {headers: headers});
  }

  public getMisDescuentos(Id_Tienda){
    let headers = new HttpHeaders({"Content-type": "application/json","Authorization": this._agenteServicio.getToken()});
    return this._http.get<objeto>(this.url + "getMisDescuentos/" + Id_Tienda, {headers: headers});
  }

  public updateEstadoDescuento(Id_Descuento, estado_a_cambiar){
    let obj = {
      estado: estado_a_cambiar
    }
    let params = JSON.stringify(obj);
    let headers = new HttpHeaders({"Content-type": "application/json","Authorization": this._agenteServicio.getToken()});
    return this._http.put<objeto>(this.url + "updateEstadoDescuento/" + Id_Descuento, params, {headers: headers});
  }

  getDescuento(Id_Descuento) {
    let headers = new HttpHeaders({"Content-type": "application/json","Authorization": this._agenteServicio.getToken()});
    return this._http.get<objeto>(this.url + "getDescuento/" + Id_Descuento, {headers: headers});
  }

  public updateDescuento(Id_Descuento, objDescuento){
    let params = JSON.stringify(objDescuento);
    let headers = new HttpHeaders({"Content-type": "application/json","Authorization": this._agenteServicio.getToken()});
    return this._http.put<objeto>(this.url + "updateDescuento/" + Id_Descuento, params, {headers: headers});
  }
  public updateEstadoDescuentos(vDescuentos, estado_a_cambiar){
    debugger;
    let params = JSON.stringify(vDescuentos);
    let headers = new HttpHeaders({"Content-type": "application/json","Authorization": this._agenteServicio.getToken()});
    return this._http.put<objeto>(this.url + "updateEstadoDescuentos/" + estado_a_cambiar, params, {headers: headers});
  }



}
