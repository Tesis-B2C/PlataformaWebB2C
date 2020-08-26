import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TiendaServicio} from "../../servicios/tienda.servicio";
import {NgbRatingConfig} from "@ng-bootstrap/ng-bootstrap";
import {GLOBAL} from 'src/app/servicios/global';
import {AgenteServicio} from "../../servicios/agente.servicio";
import {CategoriaServicio} from "../../servicios/categoria.servicio";
import {CarritoServicio} from "../../servicios/carrito.servicio";
import {MenuComponent} from "../menu/menu.component";
@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})

export class BusquedaComponent implements OnInit, OnDestroy, OnChanges {
  paginaActual = 1;
  datosXpagina = 3;
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

  constructor(private menu:MenuComponent, private _carritoServicio:CarritoServicio,private _categoriaServicio:CategoriaServicio, private _agenteServicio: AgenteServicio, private router: Router, configRating: NgbRatingConfig, private route: ActivatedRoute, private _tiendaServicio: TiendaServicio) {
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
    console.log('DATITOS OBETNIDOS' + JSON.stringify(this.datosObtenidos))
    if (this.datosObtenidos[0].length > 0) {
      this.datosObtenidos[0].forEach(elemnt => {
        let objTienda = {
          NUM_TIENDA: String,
          NOMBRE_COMERCIAL: String,
          LOGO: String
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
          NOMBRE_COMERCIAL: String,
          NOMBRE_PRODUCTO: String,
          DESCRIPCION_PRODUCTO: String,
          PROMEDIO_CAL: Number,
          TOTAL_COM: Number,
          PRECIO_CON_IVA: Number,
          IMAGEN: String,
          NUM_TIENDA: String,
          ID_OFERTA: Number,
          ID_PRODUCTO:String,
          COD_PRODUCTO:String,

        }

        objProducto.NOMBRE_COMERCIAL = elemnt.TIENDA.NOMBRE_COMERCIAL;
        objProducto.NOMBRE_PRODUCTO = elemnt.PRODUCTO.NOMBRE_PRODUCTO;
        objProducto.ID_PRODUCTO = elemnt.PRODUCTO.ID_PRODUCTO;
        objProducto.COD_PRODUCTO = elemnt.PRODUCTO.COD_PRODUCTO;
        objProducto.DESCRIPCION_PRODUCTO = elemnt.PRODUCTO.DESCRIPCION_PRODUCTO;

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
        this.vectorProductos.push(objProducto);
      })
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


  public async agregarCarrito(Id_Producto,Cod_Producto){
    try {
      let identidad = this._agenteServicio.getIdentity();
      let response = await this._carritoServicio.saveCarrito(identidad.COD_AGENTE,Id_Producto,Cod_Producto,0).toPromise();
       this.menu.conteoProductosCarrito();
    } catch (e) {
      console.log("error:" + JSON.stringify((e)));
    }
  }

}
