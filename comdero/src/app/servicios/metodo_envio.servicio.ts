import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import {GLOBAL} from "./global";
import {AgenteServicio} from "./agente.servicio";

interface objeto {
  data: JSON
}

@Injectable()

export class MetodoEnvioServicio {
  public url: String;


  constructor(private _http: HttpClient, private _agenteServicio:AgenteServicio) {
    this.url = GLOBAL.url;
  }

  guardarMetodoEnvio(Id_Tienda, Metodo_Envio_Enviar) {
    debugger
    let params = JSON.stringify(Metodo_Envio_Enviar);
    let headers = new HttpHeaders({"Content-type": "application/json","Authorization": this._agenteServicio.getToken()});
    return this._http.post<objeto>(this.url + "guardarMetodoEnvio/" + Id_Tienda, params, {headers: headers});
  }

}
