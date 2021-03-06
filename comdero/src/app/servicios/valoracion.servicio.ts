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

export class ValoracionServicio {
  public url: String;


  constructor(public _http: HttpClient, public _agenteServicio: AgenteServicio) {
    this.url = GLOBAL.url;
  }

  saveValoracion(objValoracion) {

    let params = JSON.stringify(objValoracion);
    let headers = new HttpHeaders({
      "Content-type": "application/json",
      "Authorization": this._agenteServicio.getToken()
    });
    return this._http.post<objeto>(this.url + "saveValoracion", params, {headers: headers});
  }

  updateComentario(idComentario, Comentario) {
    let obj = {
      COMENTARIO: Comentario
    }
    let params = JSON.stringify(obj);
    let headers = new HttpHeaders({
      "Content-type": "application/json",
      "Authorization": this._agenteServicio.getToken()
    });
    return this._http.put<objeto>(this.url + "updateComentario/" + idComentario, params, {headers: headers});
  }

  deleteComentario(idComentario) {
    let headers = new HttpHeaders({
      "Content-type": "application/json",
      "Authorization": this._agenteServicio.getToken()
    });
    return this._http.delete<objeto>(this.url + "deleteComentario/" + idComentario, {headers: headers});
  }

}
