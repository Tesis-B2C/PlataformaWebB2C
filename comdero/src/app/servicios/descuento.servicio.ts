import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import {GLOBAL} from "./global";

//import { Http, Headers } from "@angular/http";

interface objeto {
  data: JSON,
  message: JSON,
}


@Injectable()

export class DescuentoServicio {
  public url: String;


  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  saveDescuento(Id_Tienda,objDescuento) {
    let params = JSON.stringify(objDescuento);
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.post<objeto>(this.url + "saveDescuento/"+Id_Tienda, params, {headers: headers});
  }

  public getMisDescuentos(Id_Tienda){
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.get<objeto>(this.url + "getMisDescuentos/" + Id_Tienda, {headers: headers});
  }

  public updateEstadoDescuento(Id_Descuento, estado_a_cambiar){
    let obj = {
      estado: estado_a_cambiar
    }
    let params = JSON.stringify(obj);
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.put<objeto>(this.url + "updateEstadoDescuento/" + Id_Descuento, params, {headers: headers});
  }

  getDescuento(Id_Descuento) {
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.get<objeto>(this.url + "getDescuento/" + Id_Descuento, {headers: headers});
  }


}
