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

export class ProductoServicio {
  public url: String;


  constructor(public _http: HttpClient,public _agenteServicio: AgenteServicio) {
    this.url = GLOBAL.url;
  }

  saveProducto(ofertas, productos, variantes, imagenes, categorias) {
    let oferta = JSON.stringify(ofertas);
    let producto = JSON.stringify(productos);
    let variante = JSON.stringify(variantes);
    let imagen = JSON.stringify(imagenes);
    let categoria = JSON.stringify(categorias);
    const fd = new FormData();
    debugger;
    fd.append('oferta', oferta);
    fd.append('producto', producto);
    fd.append("variantes", variante);
    fd.append("vimagenes", imagen);
    fd.append("categorias", categoria);
    for (let i = 0; i < variantes.length; i++) {
      for (let j = 0; j < imagenes[i].length; j++) {
        debugger;
        if (imagenes[i][j].Tipo_Imagen != 'youtube') {
          // console.log("antes de enviar imagenes", imagenes[i][j].Imagen)
          fd.append("imagenes", imagenes[i][j].Imagen);
        }
      }
    }
    return this._http.post<objeto>(this.url + "saveProducto", fd,);
  }

  getMisProductos(Id_Tienda) {
    let headers = new HttpHeaders({"Content-type": "application/json","Authorization": this._agenteServicio.getToken()});
    return this._http.get<objeto>(this.url + "getMisProductos/" + Id_Tienda, {headers: headers});
  }

  getProducto(Id_Producto) {
    let headers = new HttpHeaders({"Content-type": "application/json","Authorization": this._agenteServicio.getToken()});
    return this._http.get<objeto>(this.url + "getProducto/" + Id_Producto, {headers: headers});
  }

  updateProducto(Id_Oferta, ofertas, productos, variantes, imagenes, categorias) {

    let oferta = JSON.stringify(ofertas);
    let producto = JSON.stringify(productos);
    let variante = JSON.stringify(variantes);
    let imagen = JSON.stringify(imagenes);
    let categoria = JSON.stringify(categorias);
    const fd = new FormData();
    debugger;
    fd.append('oferta', oferta);
    fd.append('producto', producto);
    fd.append("variantes", variante);
    fd.append("vimagenes", imagen);
    fd.append("categorias", categoria);
    for (let i = 0; i < variantes.length; i++) {
      for (let j = 0; j < imagenes[i].length; j++) {
        debugger;
        if (imagenes[i][j].Imagen.size) {
          // console.log("antes de enviar imagenes", imagenes[i][j].Imagen)
          fd.append("imagenes", imagenes[i][j].Imagen);
        }
      }
    }

    return this._http.put<objeto>(this.url + "updateProducto/" + Id_Oferta, fd,);
  }

  public updateEstadoProducto(Id_Oferta, estado_a_cambiar){
    let obj = {
      estado: estado_a_cambiar
    }
    let params = JSON.stringify(obj);
    let headers = new HttpHeaders({"Content-type": "application/json","Authorization": this._agenteServicio.getToken()});
    return this._http.put<objeto>(this.url + "updateEstadoProducto/" + Id_Oferta, params, {headers: headers});
  }

  public updateEstadoProductos(vOfertas, estado_a_cambiar){
  debugger;
    let params = JSON.stringify(vOfertas);
    let headers = new HttpHeaders({"Content-type": "application/json","Authorization": this._agenteServicio.getToken()});
    return this._http.put<objeto>(this.url + "updateEstadoProductos/" + estado_a_cambiar, params, {headers: headers});
  }

  obtenerTodosProductos(estado) {
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.get<objeto>(this.url + "obtenerTodosProductos/"+estado, {headers: headers});
  }

  obtenerProductoDetalle(Id_Producto) {
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.get<objeto>(this.url + "obtenerProductoDetalle/" + Id_Producto, {headers: headers});
  }

}
