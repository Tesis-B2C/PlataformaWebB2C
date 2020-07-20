import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import {GLOBAL} from "./global";

interface objeto {
  data: JSON
}

@Injectable()

export class MetodoEnvioServicio {
  public url: String;


  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  guardarMetodoEnvio(Id_Tienda, Metodo_Envio_Enviar) {
    debugger
    let params = JSON.stringify(Metodo_Envio_Enviar);
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.post<objeto>(this.url + "guardarMetodoEnvio/" + Id_Tienda, params, {headers: headers});
  }

}
