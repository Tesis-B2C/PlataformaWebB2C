import {Component, OnInit, ViewChild} from '@angular/core';
import {CategoriaServicio} from "../../servicios/categoria.servicio";
import {TiendaServicio} from "../../servicios/tienda.servicio";
import {AgenteServicio} from "../../servicios/agente.servicio";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbCarouselConfig} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  /*images = [1055, 194, 368].map((n) => `https://picsum.photos/id/${n}/2000/400`);*/
  images = ["../../../assets/estilos-principal/images/bannerPrincipal.png",];
  showNavigationArrows = false;
  showNavigationIndicators = false;

  // tslint:disable-next-line: max-line-length
  public categorias;
  public c1 = [];
  public c2;
  public c3;
  public vectorIconos = ['fa fa-charging-station', 'fa fa-tshirt',
    'fa fa-ring', 'fa fa-baby-carriage', 'fa fa-home',
    'fa fa-gem', 'fa fa-palette', 'fa fa-laptop',
    'fa fa-car', 'fa fa-dumbbell', 'fa fa-book',
    'fa fa-dog', 'fa fa-gamepad', 'fa fa-grin-stars', 'fa fa-heartbeat', 'fa fa-building', 'fa fa-tractor'];

  public productosObtenidos;
  public product = [1, 1, 9, 8, 4, 5, 5, 4, 3, 3, 4, 5, 6, 3, 4, 5];

  constructor(private route: ActivatedRoute, private router: Router, private _agenteServicio: AgenteServicio, private _tiendaServicio: TiendaServicio, private _categoriaServicio: CategoriaServicio, config: NgbCarouselConfig) {
    // customize default values of carousels used by this component tree
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

  ngOnInit() {
    this.getCategorias();
    this.obtenerTodosProductos();
  }

  public async obtenerTodosProductos() {
    let response = await this._tiendaServicio.obtenerTodosProductos().toPromise();
    console.log("PRODUCTOS" + JSON.stringify(response));
    this.productosObtenidos = response.data;
    this.productosObtenidos.forEach(elemnt => {
      console.log(elemnt.PRODUCTO.NOMBRE_PRODUCTO);
    })

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

  public async vender() {
    try {
      let identidad = this._agenteServicio.getIdentity();
      let response = await this._tiendaServicio.getMisTiendas(identidad.COD_AGENTE).toPromise();
      if (response.data) {
        this.router.navigate(['/administrador/administrador-tienda/mis-tiendas']);
      }
    } catch (e) {
      this.router.navigate(['/registro-tienda']);
      console.log("error:" + JSON.stringify((e).error.message));
    }
    // [routerLink]="['/registro-tienda']"
  }
}
