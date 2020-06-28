import { Injectable } from "@angular/core";
import { HttpClient,HttpResponse, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from "./global";
//import { Http, Headers } from "@angular/http";

interface objeto {
  data:JSON
}

@Injectable()

export class ProductoServicio {
  public url: String;


  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

/* saveProducto(Producto_Enviar)
  {

    let params = JSON.stringify(Producto_Enviar);
    let headers = new HttpHeaders({ "Content-type": "application/json" });
    return this._http.post<objeto>(this.url + "saveProducto" , params, { headers: headers });
  }*/

  saveProducto(ofertas, productos, variantes,imagenes, categorias){

    let oferta = JSON.stringify(ofertas);
    let producto = JSON.stringify(productos);
    let variante = JSON.stringify(variantes);
    let imagen = JSON.stringify(imagenes);
    let categoria=JSON.stringify(categorias);
    const  fd = new  FormData();
    debugger;
    fd.append('oferta',oferta);
    fd.append('producto',producto);
    fd.append("variantes", variante);
    fd.append("vimagenes", imagen);
    fd.append("categorias", categoria);
    for (let i = 0; i < variantes.length; i++) {
      for (let j = 0; j < imagenes[i].length; j++) {
        console.log("antes de enviar imagenes", imagenes[j].Imagen)
        fd.append("imagenes", imagenes[i][j].Imagen);
      }
    }


   /* fd.append("logo",logo);
    fd.append("banner",banner);*/
    //let params = JSON.stringify(tienda);
    // let headers = new HttpHeaders({ "Content-type": "application/json" });
    return this._http.post<objeto>(this.url + "saveProducto" ,fd,);
  }




}
