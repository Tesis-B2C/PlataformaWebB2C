import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TiendaServicio} from "../../servicios/tienda.servicio";
import {NgbRatingConfig} from "@ng-bootstrap/ng-bootstrap";
import {GLOBAL} from 'src/app/servicios/global';
import {AgenteServicio} from "../../servicios/agente.servicio";
import {CategoriaServicio} from "../../servicios/categoria.servicio";
import {CarritoServicio} from "../../servicios/carrito.servicio";
import * as moment from "moment";
import {ProductoServicio} from "../../servicios/producto.servicio";

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})

export class BusquedaComponent implements OnInit, OnDestroy, OnChanges {
  paginaActual = 1;
  datosXpagina = 2;
  paginaTamano: number = 0;
  ultimoSerie: number;

  paginaActualTienda = 1;
  datosXpaginaTienda = 4;
  paginaTamanoTienda: number;

  @Input() palabraBuscada: any;
  public vectorProductos = [];
  public vectorTienda = [];
  public datosObtenidos: any;

  currentRate = 1;
  public categorias;
  public c1 = [];
  public c2;
  public c3;
  public vectorIconos = ['fa fa-charging-station', 'fa fa-tshirt',
    'fa fa-ring', 'fa fa-baby-carriage', 'fa fa-home',
    'fa fa-gem', 'fa fa-palette', 'fa fa-laptop',
    'fa fa-car', 'fa fa-dumbbell', 'fa fa-book',
    'fa fa-dog', 'fa fa-gamepad', 'fa fa-grin-stars', 'fa fa-heartbeat', 'fa fa-building', 'fa fa-tractor'];

  constructor(public _carritoServicio: CarritoServicio, public _categoriaServicio: CategoriaServicio, public _agenteServicio: AgenteServicio, public router: Router, configRating: NgbRatingConfig, public route: ActivatedRoute, public _tiendaServicio: TiendaServicio, public _productoServicio: ProductoServicio) {
    configRating.max = 5;
    configRating.readonly = true;
  }

  ngOnInit() {
    this.ultimoSerie = this.datosXpagina;
    this.route.params.subscribe(params => {
      this.palabraBuscada = params['palabraBuscada'];
      this.buscarDatos();
    });
    this.getCategorias();

  }

  ngOnChanges() {
    this.route.params.subscribe(params => {
      this.palabraBuscada = params['palabraBuscada'];
      this.buscarDatos();
    })
  }

  ngOnDestroy() {
    delete this.vectorProductos;
    delete this.palabraBuscada;
    delete this.datosObtenidos;
    delete this.vectorTienda;
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
      console.log("error:" + JSON.stringify((e)));
    }
  }

  public noExite = 'assets/images/no-image.png';

  getImagen(pathImagen) {
    this.noExite = 'assets/images/no-image.png';
    if (pathImagen) {
      this.noExite = GLOBAL.urlImagen + pathImagen;
    }
    return this.noExite;
  }

  public onPageChange(pageNum: number): void {
    this.paginaTamano = this.datosXpagina * (pageNum - 1);
  }

  public changePagesize(num: number): void {
    this.datosXpagina = this.paginaTamano + num;
  }

  public onPageChangeTienda(pageNum: number): void {
    this.paginaTamanoTienda = this.datosXpaginaTienda * (pageNum - 1);
  }

  public async buscarDatos() {
    this.vectorProductos = [];
    this.vectorTienda = [];
    let response = await this._tiendaServicio.obtenerFiltroBusquedaTodos(this.palabraBuscada).toPromise();
    this.datosObtenidos = response.data;
    console.log('produto obtenido para filtrar' + JSON.stringify(this.datosObtenidos))
    if (this.datosObtenidos[0].length > 0) {
      this.datosObtenidos[0].forEach(elemnt => {
        let objTienda = {
          NUM_TIENDA: null,
          NOMBRE_COMERCIAL: null,
          LOGO: null
        }
        objTienda.NUM_TIENDA = elemnt.NUM_TIENDA;
        objTienda.NOMBRE_COMERCIAL = elemnt.NOMBRE_COMERCIAL;
        objTienda.LOGO = elemnt.LOGO;
        this.vectorTienda.push(objTienda);
      })
    }

    if (this.datosObtenidos[1].length > 0) {
      this.datosObtenidos[1].forEach((elemnt) => {
        let objProducto = {
          NOMBRE_COMERCIAL: null,
          NOMBRE_PRODUCTO: null,
          DESCRIPCION_PRODUCTO: null,
          PROMEDIO_CAL: null,
          TOTAL_COM: null,
          PRECIO_CON_IVA: null,
          IMAGEN: null,
          NUM_TIENDA: null,
          ID_OFERTA: null,
          ID_PRODUCTO: null,
          COD_PRODUCTO: null,
          CONDICION: null,
          DESCUENTO_AUTOMATICO: null
        }

        objProducto.NOMBRE_COMERCIAL = elemnt.TIENDA.NOMBRE_COMERCIAL;
        objProducto.NOMBRE_PRODUCTO = elemnt.PRODUCTO.NOMBRE_PRODUCTO;
        objProducto.ID_PRODUCTO = elemnt.PRODUCTO.ID_PRODUCTO;
        objProducto.COD_PRODUCTO = elemnt.PRODUCTO.COD_PRODUCTO;
        objProducto.DESCRIPCION_PRODUCTO = elemnt.PRODUCTO.DESCRIPCION_PRODUCTO;
        objProducto.CONDICION = elemnt.PRODUCTO.CONDICION;

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
        this.vectorProductos.push(objProducto);
      })
    }
    console.log(JSON.stringify(this.vectorProductos));
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
      this.PRECIO_UNITARIO_CON_IVA_DESCUENTO = PRECIO_CON_IVA - ((PRECIO_CON_IVA * this.porcentajeDescuento) / 100);
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
