import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TiendaServicio} from "../../servicios/tienda.servicio";
import {GLOBAL} from "../../servicios/global";
import * as moment from "moment";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";
import {AgenteServicio} from "../../servicios/agente.servicio";
import {NgbRatingConfig} from "@ng-bootstrap/ng-bootstrap";
import {CategoriaServicio} from "../../servicios/categoria.servicio";

@Component({
  selector: 'app-busqueda-categoria',
  templateUrl: './busqueda-categoria.component.html',
  styleUrls: ['./busqueda-categoria.component.css']
})
export class BusquedaCategoriaComponent implements OnInit {
  paginaActual = 1;
  datosXpagina = 10;
  paginaTamano: number = 0;
  ultimoSerie: number;

  paginaActualTienda = 1;
  datosXpaginaTienda = 4;
  paginaTamanoTienda: number;

  constructor(public _categoriaServicio: CategoriaServicio, public configRating: NgbRatingConfig, public router: Router, public _agenteServicio: AgenteServicio, public _tiendaServicio: TiendaServicio, public route: ActivatedRoute) {
    configRating.max = 5;
    configRating.readonly = true;
  }

  public vectorProductos = [];
  public vectorTienda = [];
  public datosObtenidos: any;

  currentRate = 1;
  public categorias;
  public c1 = [];
  public c2 = [];
  public c3 = [];
  public categoria;
  public bandera:boolean=true;
  public vectorIconos = ['fa fa-charging-station', 'fa fa-tshirt',
    'fa fa-ring', 'fa fa-baby-carriage', 'fa fa-home',
    'fa fa-gem', 'fa fa-palette', 'fa fa-laptop',
    'fa fa-car', 'fa fa-dumbbell', 'fa fa-book',
    'fa fa-dog', 'fa fa-gamepad', 'fa fa-grin-stars', 'fa fa-heartbeat', 'fa fa-building', 'fa fa-tractor'];
  public palabraBuscada;

  async ngOnInit() {
    this.getCategorias()
    this.route.params.subscribe(params => {
      this.categoria = params.categoria;
      this.palabraBuscada = params.nombre;
      this.buscarDatos();

    });
  }

  ngOnChanges() {
    this.route.params.subscribe(params => {
      this.categoria = params.categoria;
      this.palabraBuscada = params.nombre;
      this.buscarDatos();

    });
  }


  public async getCategorias() {
    try {
      let response = await this._categoriaServicio.getCategorias().toPromise();

      this.categorias = response.data;

      this.categorias.forEach(elemnt => {
        if (elemnt.TIPO == 'C1') {
          this.c1.push(elemnt)
        } else if (elemnt.TIPO == 'C2') {
          this.c2.push(elemnt)
        } else if (elemnt.TIPO == 'C3') {
          this.c3.push(elemnt)
        }
      })


    } catch (e) {
      if (!(e instanceof HttpErrorResponse)) {
        console.log("error Parseado:" + typeof (e) + JSON.stringify(e));
        console.log("error como objeto:" + e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }

  }

  verificar(codigo, nombre) {
    let bandera: boolean = false;
    this.categorias.forEach(elemnt => {
      if (elemnt.CAT_ID_CATEGORIA == codigo) {
        bandera = true
      }
    });

    if (!bandera) {
      this.router.navigate(['/principales/menu/busqueda-categoria', codigo, nombre])

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
    let response = await this._tiendaServicio.obtenerFiltroBusquedaTodosCategoria(this.categoria).toPromise()
    this.datosObtenidos = response.data;


    if (this.datosObtenidos.length > 0) {

      this.datosObtenidos.forEach((elemnt) => {
        let objProducto = {
          NOMBRE_COMERCIAL_TIENDA_PRODUCTO: null,
          NOMBRE: null,
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
          DESCUENTO_AUTOMATICO: null,
          TIPO: 'Producto',
          FECHA_CREACION: null
        }
        objProducto.NOMBRE_COMERCIAL_TIENDA_PRODUCTO = elemnt.OFERTum.TIENDA.NOMBRE_COMERCIAL;
        objProducto.NOMBRE = elemnt.NOMBRE_PRODUCTO;
        objProducto.ID_PRODUCTO = elemnt.ID_PRODUCTO;
        objProducto.COD_PRODUCTO = elemnt.COD_PRODUCTO;
        objProducto.DESCRIPCION_PRODUCTO = elemnt.DESCRIPCION_PRODUCTO;
        objProducto.CONDICION = elemnt.CONDICION;
        objProducto.FECHA_CREACION = false;
        debugger;
        if (elemnt.OFERTum.FECHA_CREACION >= moment().subtract(1, 'months').format("YYYY-MM-DD") && elemnt.OFERTum.FECHA_CREACION <= moment().format("YYYY-MM-DD")) {
          objProducto.FECHA_CREACION = true;
        }


        if (elemnt.CALIFICACIONs.length > 0)
          objProducto.PROMEDIO_CAL = elemnt.CALIFICACIONs[0].PROMEDIO_CAL;
        else
          objProducto.PROMEDIO_CAL = null;

        if (elemnt.COMENTARIOs.length > 0)
          objProducto.TOTAL_COM = elemnt.COMENTARIOs[0].TOTAL_COM;
        else
          objProducto.TOTAL_COM = null;

        objProducto.PRECIO_CON_IVA = ((elemnt.VARIANTEs[0].PRECIO_UNITARIO * elemnt.OFERTum.IVA) / 100) + elemnt.VARIANTEs[0].PRECIO_UNITARIO;
        objProducto.IMAGEN = elemnt.VARIANTEs[0].IMAGEN_PRODUCTOs[0].IMAGEN;
        objProducto.NUM_TIENDA = elemnt.OFERTum.TIENDA.NUM_TIENDA;
        objProducto.ID_OFERTA = elemnt.OFERTum.ID_OFERTA;
        objProducto.DESCUENTO_AUTOMATICO = this.buscarDescuentoAutomatico(elemnt.PRODUCTO_DESCUENTOs, objProducto.PRECIO_CON_IVA);
        this.vectorProductos.push(objProducto);
      })
    }

    let vproductosAux = this.vectorProductos;
    this.vectorProductos = vproductosAux;
    this.vectorProductos.sort(function (a, b) {
      if (a.NOMBRE.toUpperCase() > b.NOMBRE.toUpperCase()) {
        return 1;
      }
      if (a.NOMBRE.toUpperCase() < b.NOMBRE.toUpperCase()) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });

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
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' + this.PRECIO_UNITARIO_CON_IVA_DESCUENTO + 'PRECIO DESCUENTO' + this.porcentajeDescuento + 'DESCUENTO');
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
      let misTiendas: any = response.data;
      if (misTiendas.length > 0) {
        this.router.navigate(['/administrador/administrador-tienda/mis-tiendas']);
      } else {
        this.router.navigate(['/registro-tienda']);
      }
    } catch (e) {
      if (!(e instanceof HttpErrorResponse)) {
        console.log("error Parseado:" + typeof (e) + JSON.stringify(e));
        console.log("error como objeto:" + e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }


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
