import {Component, OnInit} from '@angular/core';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import {CategoriaServicio} from "../../servicios/categoria.servicio";

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
  providers: [NgbCarouselConfig]
})
export class PrincipalComponent implements OnInit {
  showNavigationArrows = false;
  showNavigationIndicators = false;
  /*images = [1055, 194, 368].map((n) => `https://picsum.photos/id/${n}/2000/400`);*/
  images = ["../../../assets/estilos-principal/images/bannerPrincipal.png",];


  // tslint:disable-next-line: max-line-length
  public categorias;
  public c1=[];
  public c2;
  public c3;

  constructor(private _categoriaServicio: CategoriaServicio, config: NgbCarouselConfig) {
    // customize default values of carousels used by this component tree
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

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
