import { Injectable } from "@angular/core";
import { HttpClient,HttpResponse, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from "./global";
//import { Http, Headers } from "@angular/http";

interface objeto {
  data:JSON
}

@Injectable()

export class CategoriaServicio {
  public url: String;


  constructor(public _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  getCategorias()
  {
    let headers = new HttpHeaders({ "Content-type": "application/json" });
    return this._http.get<objeto>(this.url + "getCategorias/" , { headers: headers });
  }

}
