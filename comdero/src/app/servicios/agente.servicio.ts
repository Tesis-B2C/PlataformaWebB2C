import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import {GLOBAL} from "./global";

//import { Http, Headers } from "@angular/http";

interface objeto {
  data: JSON,
  message: JSON,
  token: JSON
}

@Injectable()

export class AgenteServicio {
  public url: String;
  public identity;
  public token;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  registrarAgente(agente) {
    let params = JSON.stringify(agente);
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.post<objeto>(this.url + "registrarAgente", params, {headers: headers});
  }

  autenticarAgente(agente, getHash) {
    if (getHash) {
      console.log("aqui va el hash", getHash);
      agente.getHash = getHash;
      console.log(agente.getHash);
    }
    let params = JSON.stringify(agente);
    console.log(params);
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.post<objeto>(this.url + "autenticarAgente", params, {headers: headers});

  }

  autenticarActivarAgente(agente, getHash, token) {
    if (getHash) {
      console.log("aqui va el hash", getHash);
      agente.getHash = getHash;
      console.log(agente.getHash);
    }
    let params = JSON.stringify(agente);
    console.log(params);
    let headers = new HttpHeaders({"Content-type": "application/json", "Authorization": token});
    return this._http.post<objeto>(this.url + "autenticarActivarAgente", params, {headers: headers});

  }


  resetearContrasenia(obj) {
    let params = JSON.stringify(obj);
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.post<objeto>(this.url + "resetearContrasenia", params, {headers: headers});
  }

  resetearContrasenia2(token, obj) {
    let params = JSON.stringify(obj);
    let headers = new HttpHeaders({"Content-type": "application/json", "Authorization": token});
    return this._http.put<objeto>(this.url + "resetearContrasenia2", params, {headers: headers});
  }


  getIdentity() {
    let identity = JSON.parse(localStorage.getItem("identity"));
    if (identity != "undefined") {
      this.identity = identity;
    } else {
      this.identity = null;
    }
    return this.identity;
  }

  getToken() {
    let token = localStorage.getItem("Token");
    if (token != "undefined") {
      this.token = token;
    } else {
      this.token = null;
    }
    return this.token;
  }


  logout() {
    localStorage.removeItem("identity");
    localStorage.removeItem("Token");
    localStorage.clear();
    this.identity = null;
    this.token = null;
    location.reload(true);
  }

  actualizarAgente(agente_actualizar) {
    debugger
    let params = JSON.stringify(agente_actualizar);
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.put<objeto>(this.url + "actualizarAgente/" + agente_actualizar.Correo, params, {headers: headers});
  }

  verificarExistenciaCorreo(objeto_cambio_correo) {

    let params = JSON.stringify(objeto_cambio_correo);
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.post<objeto>(this.url + "verificarExistenciaCorreo", params, {headers: headers});

  }

  cambioCorreoAgente(correo, cambio_correo) {
    debugger;
    let obj = {
      correo: cambio_correo
    }
    let params = JSON.stringify(obj);
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.put<objeto>(this.url + "cambioCorreoAgente/" + correo, params, {headers: headers});

  }

  actualizarAgenteIdentity(correo) {

    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.get<objeto>(this.url + "actualizarAgenteIdentity/" + correo, {headers: headers});
  }

  actualizarContrasenia(correo,objetoContrasenia) {

    let params = JSON.stringify(objetoContrasenia);
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.put<objeto>(this.url + "actualizarContrasenia/" + correo, params, {headers: headers});

  }

}
