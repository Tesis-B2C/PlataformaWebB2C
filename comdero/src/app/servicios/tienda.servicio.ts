import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GLOBAL} from "./global";

interface objeto {
  data: JSON,
  message: JSON,
  token: JSON
}

@Injectable()

export class TiendaServicio {
  public url: String;
  public identity;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  registrarTienda(tienda, logo: File, banner: File) {

    let params = JSON.stringify(tienda);
    const fd = new FormData();
    debugger;
    fd.append('tienda', params);
    fd.append("logo", logo);
    fd.append("banner", banner);
    //let params = JSON.stringify(tienda);
    // let headers = new HttpHeaders({ "Content-type": "application/json" });
    return this._http.post<objeto>(this.url + "registrarTienda", fd,);
  }

  /*  subirImagenesServidor(formData,Id_Tienda, tipo){
      return this._http.post<objeto>(this.url + "subirImagenesTienda/"+Id_Tienda+"/"+tipo, formData);
    }*/

  getDatosTienda(Id_Tienda) {
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.get<objeto>(this.url + "getDatosTienda/" + Id_Tienda, {headers: headers});
  }

  getMisTiendas(Id_Agente) {
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.get<objeto>(this.url + "getMisTiendas/" + Id_Agente, {headers: headers});
  }

  public updateEstadoTienda(Id_Tienda, estado_a_cambiar) {
    let obj = {
      estado: estado_a_cambiar
    }
    let params = JSON.stringify(obj);
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.put<objeto>(this.url + "updateEstadoTienda/" + Id_Tienda, params, {headers: headers});
  }

  public updatePersonalizacionTienda(Id_Tienda,logo: File, banner: File) {
    const fd = new FormData();
    debugger;
    fd.append("logo", logo);
    fd.append("banner", banner);
    return this._http.put<objeto>(this.url + "updatePersonalizacionTienda/" + Id_Tienda, fd,);
  }

  getIdentityTienda() {
    let identity = JSON.parse(localStorage.getItem("identityTienda"));
    if (identity != "undefined") {
      this.identity = identity;
    } else {
      this.identity = null;
    }
    return this.identity;
  }

  actualizarTiendaGeneral(tienda_actualizar, Num_Tienda) {
    debugger
    let params = JSON.stringify(tienda_actualizar);
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.put<objeto>(this.url + "actualizarTiendaGeneral/" + Num_Tienda, params, {headers: headers});
  }

  actualizarTiendaSucursal(tiendaSucursal_actualizar, Num_Tienda) {
    debugger
    let params = JSON.stringify(tiendaSucursal_actualizar);
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.put<objeto>(this.url + "actualizarTiendaSucursal/" + Num_Tienda, params, {headers: headers});
  }

  obtenerTodosProductos() {
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.get<objeto>(this.url + "obtenerTodosProductos", {headers: headers});
  }

  obtenerFiltroPrincipalTodos(termino) {
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.get<objeto>(this.url + "obtenerFiltroPrincipalTodos/"+ termino, {headers: headers});
  }

  obtenerFiltroPrincipalTienda(termino) {
      let headers = new HttpHeaders({"Content-type": "application/json"});
      return this._http.get<objeto>(this.url + "obtenerFiltroPrincipalTienda/"+ termino, {headers: headers});
  }

  obtenerFiltroPrincipalProductos(termino) {
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.get<objeto>(this.url + "obtenerFiltroPrincipalProductos/"+ termino, {headers: headers});
  }

  getDetalleTiendaProducto(Id_Tienda) {
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.get<objeto>(this.url + "getDetalleTiendaProducto/" + Id_Tienda, {headers: headers});
  }

  obtenerTodasTiendas() {
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.get<objeto>(this.url + "obtenerTodasTiendas", {headers: headers});
  }
}
