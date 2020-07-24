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

  saveDescuento(objDescuento) {
    let params = JSON.stringify(objDescuento);
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.post<objeto>(this.url + "saveDescuento", params, {headers: headers});
  }

  public getMisDescuentos(Id_Tienda){
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.get<objeto>(this.url + "getMisDescuentos/" + Id_Tienda, {headers: headers});
  }

}
