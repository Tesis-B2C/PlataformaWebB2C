

import { Injectable } from "@angular/core";
import { HttpClient,HttpResponse, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from "./global";
//import { Http, Headers } from "@angular/http";
interface objeto {
  data: JSON,
  message: JSON,
}


@Injectable()

export class CorreoServicio {
  public url: String;


  constructor(public _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  correoActivacion(objeto) {
    let json = JSON.stringify(objeto);
    let params = json;
    console.log(params);
    let headers = new HttpHeaders({ "Content-type": "application/json" });
    return this._http.post<objeto>(this.url + "correoActivacion/",params , { headers: headers });
  }


  correoCambioContrasenia(objeto) {
    let json = JSON.stringify(objeto);
    let params = json;
    console.log(params);
    let headers = new HttpHeaders({ "Content-type": "application/json" });
    return this._http.post<objeto>(this.url + "correoCambioContrasenia/",params , { headers: headers });
  }


  correoCambioCorreo(objeto) {
    let json = JSON.stringify(objeto);
    let params = json;
    console.log(params);
    let headers = new HttpHeaders({ "Content-type": "application/json" });
    return this._http.post<objeto>(this.url + "correoCambioCorreo/",params , { headers: headers });
  }

}
