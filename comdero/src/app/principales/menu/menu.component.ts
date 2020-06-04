import { Component, OnInit } from '@angular/core';
import {CategoriaServicio} from "../../servicios/categoria.servicio";
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  public categorias;
  public c1=[];
  public c2;
  public c3;

  constructor(private _categoriaServicio: CategoriaServicio) { }

  ngOnInit() {
    this.getCategorias();
  }
  public async getCategorias() {
    try {
      let response = await this._categoriaServicio.getCategorias().toPromise();

      this.categorias = response.data;

      this.categorias.forEach(elemnt => {
        if (elemnt.TIPO == 'C1') {
          this.c1.push(elemnt)
        } /*else if (elemnt.TIPO == 'C2') {
          this.c2.push(elemnt)
        } else if (elemnt.TIPO == 'C3') {
          this.c3.push(elemnt)
        }*/
      })


    } catch (e) {
      console.log("error:" + JSON.stringify((e).error.message));
    }

  }
}
