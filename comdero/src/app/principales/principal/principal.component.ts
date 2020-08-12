import {Component, OnInit} from '@angular/core';
import {CategoriaServicio} from "../../servicios/categoria.servicio";
import {TiendaServicio} from "../../servicios/tienda.servicio";
import {AgenteServicio} from "../../servicios/agente.servicio";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbCarouselConfig} from "@ng-bootstrap/ng-bootstrap";
import {OwlOptions} from 'ngx-owl-carousel-o';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import { GLOBAL } from 'src/app/servicios/global';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
  providers: [NgbRatingConfig]
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

  opcionesCarrouselFilaUno: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    autoplay: true,
    autoplaySpeed: 1000,

    animateOut: 'slideOutDown',
    animateIn: 'flipInX',
    navText: ["", ""],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 4
      },
      940: {
        items: 4
      }
    },
    nav: false
  }

  opcionesCarrouselTienda: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 1000,

    autoplay: true,
    autoplayTimeout:2000,
    autoplaySpeed: 1000,
    fluidSpeed: true,

    animateOut: 'slideOutDown',
    animateIn: 'flipInX',
    navText: ["", ""],
    responsive: {
      0: {
        items: 2
      },
      400: {
        items: 2
      },
      740: {
        items: 4
      },
      940: {
        items: 4
      }
    },
    nav: false
  }


  public vectorProductosObtenidos = [];
  currentRate = 1;

  constructor(configRating: NgbRatingConfig, private route: ActivatedRoute, private router: Router, private _agenteServicio: AgenteServicio, private _tiendaServicio: TiendaServicio, private _categoriaServicio: CategoriaServicio, config: NgbCarouselConfig) {
    configRating.max = 5;
    configRating.readonly = true;
    // customize default values of carousels used by this component tree
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

  ngOnInit() {
    this.getCategorias();
    this.obtenerTodosProductos();
    this.obtenerTodasTiendas();
  }

  public noExite = 'assets/images/no-imagen1.png';

  getImagen(pathImagen) {
    this.noExite = 'assets/images/no-imagen1.png';
    if (pathImagen) {
      this.noExite = GLOBAL.urlImagen + pathImagen;
    }
    return this.noExite;
  }

  public async obtenerTodosProductos() {
    let response = await this._tiendaServicio.obtenerTodosProductos().toPromise();
    //console.log("PRODUCTOS" + JSON.stringify(response));
    this.productosObtenidos = response.data;
    this.productosObtenidos.forEach(elemnt => {
      this.vectorProductosObtenidos.push(elemnt);
    })

  }

  public tiendasObtenidas;
  public vectorTiendasObtenidas = [];

  public async obtenerTodasTiendas() {
    let response = await this._tiendaServicio.obtenerTodasTiendas().toPromise();
    console.log("tiendas" + response.data);
    this.tiendasObtenidas = response.data;
    for (let element of this.tiendasObtenidas) {
      this.vectorTiendasObtenidas.push(element);
    }
    ;

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
