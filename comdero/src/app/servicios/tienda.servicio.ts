import { Injectable } from "@angular/core";
import { HttpClient,HttpResponse, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from "./global";
//import { Http, Headers } from "@angular/http";

interface objeto {
  data:JSON,
  message:JSON,
  token:JSON
}

@Injectable()

export class TiendaServicio {
  public url: String;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  registrarTienda(tienda){
    debugger;
    let params = JSON.stringify(tienda);
    let headers = new HttpHeaders({ "Content-type": "application/json" });
    return this._http.post<objeto>(this.url + "registrarTienda" , params,{ headers: headers });
  }

  subirImagenesServidor(formData,Id_Tienda, tipo){
    return this._http.post<objeto>(this.url + "subirImagenesTienda/"+Id_Tienda+"/"+tipo, formData);
  }

  getDatosTienda(Id_Tienda){
      let headers = new HttpHeaders({ "Content-type": "application/json" });
      return this._http.get<objeto>(this.url + "getDatosTienda/"+Id_Tienda , { headers: headers });
  }

  getMisTiendas(Id_Tienda){
    let headers = new HttpHeaders({ "Content-type": "application/json" });
    return this._http.get<objeto>(this.url + "getMisTiendas/"+Id_Tienda , { headers: headers });
  }
}
