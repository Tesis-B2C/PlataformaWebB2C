import {Component, OnInit} from '@angular/core';
import {CategoriaServicio} from "../../servicios/categoria.servicio";
import {TiendaServicio} from "../../servicios/tienda.servicio";
import {AgenteServicio} from "../../servicios/agente.servicio";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbCarouselConfig} from "@ng-bootstrap/ng-bootstrap";
import {OwlOptions} from 'ngx-owl-carousel-o';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import {GLOBAL} from 'src/app/servicios/global';
import * as moment from "moment";
import {ProductoServicio} from "../../servicios/producto.servicio";
import Swal from "sweetalert2";
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
    dots: false,
    navSpeed: 700,
    autoplay: true,
    autoplaySpeed: 1000,

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
        items: 5
      }
    },
    nav: false
  }

  opcionesCarrouselTienda: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 1000,

    autoplay: true,
    autoplayTimeout: 2000,
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
        items: 5
      }
    },
    nav: false
  }


  public vectorProductosObtenidos = [];
  currentRate = 1;

  constructor(configRating: NgbRatingConfig, public route: ActivatedRoute, public router: Router, public _agenteServicio: AgenteServicio, public _tiendaServicio: TiendaServicio, public _productoServicio: ProductoServicio, public _categoriaServicio: CategoriaServicio, config: NgbCarouselConfig) {
    configRating.max = 5;
    configRating.readonly = true;
    // customize default values of carousels used by this component tree
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

  public nuevos;
  public populares;
  public recomendados;

  async ngOnInit() {
    this.getCategorias();
    this.nuevos = await this.obtenerTodosProductos(0); // nuevos
    this.populares = await this.obtenerTodosProductos(1); //populares o con mas estrellas
    this.recomendados = await this.obtenerTodosProductos(2);// recomendados o con mas
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

  public async obtenerTodosProductos(estado) {
    this.vectorProductosObtenidos = [];
    try {
      let response = await this._productoServicio.obtenerTodosProductos(estado).toPromise();
      console.log("PRODUCTOS" + JSON.stringify(response));
      this.productosObtenidos = response.data;
      this.productosObtenidos.forEach(elemnt => {
        let objProducto = {
          NOMBRE_COMERCIAL: null,
          NOMBRE_PRODUCTO: null,
          PROMEDIO_CAL: null,
          TOTAL_COM: null,
          PRECIO_CON_IVA: null,
          IMAGEN: null,
          NUM_TIENDA: null,
          ID_OFERTA: null,
          ID_PRODUCTO: null,
          COD_PRODUCTO: null,
          DESCUENTO_AUTOMATICO: null
        }

        objProducto.NOMBRE_COMERCIAL = elemnt.TIENDA.NOMBRE_COMERCIAL;
        objProducto.NOMBRE_PRODUCTO = elemnt.PRODUCTO.NOMBRE_PRODUCTO;
        objProducto.ID_PRODUCTO = elemnt.PRODUCTO.ID_PRODUCTO;
        objProducto.COD_PRODUCTO = elemnt.PRODUCTO.COD_PRODUCTO;

        if (elemnt.PRODUCTO.CALIFICACIONs.length > 0)
          objProducto.PROMEDIO_CAL = elemnt.PRODUCTO.CALIFICACIONs[0].PROMEDIO_CAL;
        else
          objProducto.PROMEDIO_CAL = null;

        if (elemnt.PRODUCTO.COMENTARIOs.length > 0)
          objProducto.TOTAL_COM = elemnt.PRODUCTO.COMENTARIOs[0].TOTAL_COM;
        else
          objProducto.TOTAL_COM = null;

        objProducto.PRECIO_CON_IVA = ((elemnt.PRODUCTO.VARIANTEs[0].PRECIO_UNITARIO * elemnt.IVA) / 100) + elemnt.PRODUCTO.VARIANTEs[0].PRECIO_UNITARIO;
        objProducto.IMAGEN = elemnt.PRODUCTO.VARIANTEs[0].IMAGEN_PRODUCTOs[0].IMAGEN;
        objProducto.NUM_TIENDA = elemnt.TIENDA.NUM_TIENDA;
        objProducto.ID_OFERTA = elemnt.ID_OFERTA;
        objProducto.DESCUENTO_AUTOMATICO = this.buscarDescuentoAutomatico(elemnt.PRODUCTO.PRODUCTO_DESCUENTOs, objProducto.PRECIO_CON_IVA);

        this.vectorProductosObtenidos.push(objProducto);
      });

      if (estado == 1) {
        this.vectorProductosObtenidos.sort(function (a, b) {
          if (a.PROMEDIO_CAL > b.PROMEDIO_CAL) {
            return 1;
          }
          if (a.PROMEDIO_CAL < b.PROMEDIO_CAL) {
            return -1;
          }
          // a must be equal to b
          return 0;
        }).reverse();
      }

      if (estado == 2) {
        this.vectorProductosObtenidos.sort(function (a, b) {
          if (a.TOTAL_COM > b.TOTAL_COM) {
            return 1;
          }
          if (a.TOTAL_COM < b.TOTAL_COM) {
            return -1;
          }
          return 0;
        }).reverse();
      }

      return this.vectorProductosObtenidos;
    } catch (e) {
      console.log("error Parseado:" + JSON.stringify(e));
      console.log("error como objeto:"+ e);
      if (JSON.stringify(e) === '{}')
        this.mensageError(e);
      else this.mensageError(JSON.stringify(e));
    }
  }

  public porcentajeDescuento = null;
  public PRECIO_UNITARIO_CON_IVA_DESCUENTO = null;

  public buscarDescuentoAutomatico(PRODUCTO_DESCUENTOs, PRECIO_CON_IVA) {
    let fechaHoy = moment().format("YYYY-MM-DD");
    let horaActual = moment().format("HH:mm:ss");
    console.log('horaHoy' + horaActual + fechaHoy)
    if (PRODUCTO_DESCUENTOs.length > 0) {
      this.porcentajeDescuento = 0;
      this.PRECIO_UNITARIO_CON_IVA_DESCUENTO = 0;
      PRODUCTO_DESCUENTOs.forEach(descuentoAut => {
        if (descuentoAut.DESCUENTO.TIPO_DESCUENTO == 'Automático') {
          if (descuentoAut.DESCUENTO.FECHA_INICIO == fechaHoy) {
            if ((this.obtenerMinutos(horaActual) >= this.obtenerMinutos(descuentoAut.DESCUENTO.HORA_INICIO))) {
              //CUPON VALIDO
              this.porcentajeDescuento = this.porcentajeDescuento + descuentoAut.DESCUENTO.PORCENTAJE_DESCUENTO;
              console.log('1XX' + horaActual + fechaHoy)
            }
          } else {
            if (descuentoAut.DESCUENTO.FECHA_FIN == fechaHoy) {
              if ((this.obtenerMinutos(horaActual) <= this.obtenerMinutos(descuentoAut.DESCUENTO.HORA_FIN))) {
                //CUPON VALIDO
                this.porcentajeDescuento = this.porcentajeDescuento + descuentoAut.DESCUENTO.PORCENTAJE_DESCUENTO;
                console.log('2XX' + horaActual + fechaHoy);
              } else {
                //CUPON FUERA DE LA HORA
                this.porcentajeDescuento = this.porcentajeDescuento + 0;
              }
            } else {
              //CUPON VALIDO
              this.porcentajeDescuento = this.porcentajeDescuento + descuentoAut.DESCUENTO.PORCENTAJE_DESCUENTO;
              console.log('3XX' + horaActual + fechaHoy);
            }
          }
        }
      })

      if (this.porcentajeDescuento > 0) {
        this.PRECIO_UNITARIO_CON_IVA_DESCUENTO = PRECIO_CON_IVA - ((PRECIO_CON_IVA * this.porcentajeDescuento) / 100);
      } else {
        this.PRECIO_UNITARIO_CON_IVA_DESCUENTO = null;
      }
    } else {
      this.porcentajeDescuento = null;
      this.PRECIO_UNITARIO_CON_IVA_DESCUENTO = null;
    }

    return this.PRECIO_UNITARIO_CON_IVA_DESCUENTO;
    console.log(this.PRECIO_UNITARIO_CON_IVA_DESCUENTO + 'PRECIO DESCUENTO' + this.porcentajeDescuento + 'DESCUENTO');
  }

  public obtenerMinutos(hora) {
    if (hora) {
      var spl = hora.split(":");
      return parseInt(spl[0]) * 60 + parseInt(spl[1]);
    }
  }


  public tiendasObtenidas;
  public vectorTiendasObtenidas = [];

  public async obtenerTodasTiendas() {
    try {
      let response = await this._tiendaServicio.obtenerTodasTiendas().toPromise();
      console.log("tiendas" + response.data);
      this.tiendasObtenidas = response.data;
      for (let element of this.tiendasObtenidas) {
        this.vectorTiendasObtenidas.push(element);
      }
    } catch (e) {
      console.log("error Parseado:" + JSON.stringify(e));
      console.log("error como objeto:"+ e);
      if (JSON.stringify(e) === '{}')
        this.mensageError(e);
      else this.mensageError(JSON.stringify(e));
    }
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
      console.log("error Parseado:" + JSON.stringify(e));
      console.log("error como objeto:"+ e);
      if (JSON.stringify(e) === '{}')
        this.mensageError(e);
      else this.mensageError(JSON.stringify(e));
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

  mensageError(mensaje) {
    Swal.fire({
      icon: 'error',
      title: '<header class="login100-form-title-registro"><h5 class="card-title">!Error..</h5></header>',
      text: mensaje,
      position: 'center',
      width: 600,
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-primary px-5',
        container: 'my-swal'
        //icon:'sm'
      }
    });
  }

}
