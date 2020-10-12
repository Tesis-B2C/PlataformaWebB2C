import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import {GLOBAL} from "./global";
import {AgenteServicio} from "./agente.servicio";

//import { Http, Headers } from "@angular/http";

interface objeto {
  data: JSON
}

@Injectable()

export class NotificacionesServicio {
  public url: String;


  constructor(public _http: HttpClient, public _agenteServicio: AgenteServicio) {
    this.url = GLOBAL.url;
  }

  getMisNotificaciones() {
    let headers = new HttpHeaders({
      "Content-type": "application/json",
      "Authorization": this._agenteServicio.getToken()
    });
    return this._http.get<objeto>(this.url + "getMisNotificaciones/", {headers: headers});
  }
  getMisNotificacionesTienda(idTienda) {
    let headers = new HttpHeaders({
      "Content-type": "application/json",
      "Authorization": this._agenteServicio.getToken()
    });
    return this._http.get<objeto>(this.url + "getMisNotificacionesTienda/"+idTienda, {headers: headers});
  }


  updateEstadoNotificacion(idNotificacion, estado_a_cambiar) {
    debugger;
    let obj={estado:estado_a_cambiar}
    let params = JSON.stringify(obj);
    let headers = new HttpHeaders({"Content-type": "application/json", "Authorization": this._agenteServicio.getToken()});
    return this._http.put<objeto>(this.url + "updateEstadoNotificacion/"+idNotificacion, params, {headers: headers});
  }
}
