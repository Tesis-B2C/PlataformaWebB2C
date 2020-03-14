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

export class AgenteServicio {
  public url: String;


  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

registrarAgente(agente){
  let params = JSON.stringify(agente);
  let headers = new HttpHeaders({ "Content-type": "application/json" });
  return this._http.post<objeto>(this.url + "registrarAgente" , params,{ headers: headers });
}

  autenticarAgente(agente, getHash) {
    if (getHash) {
      console.log("aqui va el hash", getHash);
      agente.getHash = getHash;
      console.log(agente.getHash);
    }
    let params = JSON.stringify(agente);
    console.log(params);
    let headers = new HttpHeaders({ "Content-type": "application/json" });
    return this._http.post<objeto>(this.url + "autenticarAgente" , params,{ headers: headers });

  }

  resetearContrasenia(obj){
    let params = JSON.stringify(obj);
    let headers = new HttpHeaders({ "Content-type": "application/json" });
    return this._http.post<objeto>(this.url + "resetearContrasenia" , params,{ headers: headers });
  }

  resetearContrasenia2(token,obj){
    let params = JSON.stringify(obj);
    let headers = new HttpHeaders({ "Content-type": "application/json","Authorization":token });
    return this._http.put<objeto>(this.url + "resetearContrasenia2",params,{ headers: headers });
  }
}
