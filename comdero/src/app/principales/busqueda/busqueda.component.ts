import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TiendaServicio} from "../../servicios/tienda.servicio";
import {NgbRatingConfig} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})

export class BusquedaComponent implements OnInit, OnDestroy {
  paginaActual = 1;
  datosXpagina = 15;
  paginaTamano: number;

  @Input() palabraBuscada: any;
  public vectorProductos = [];
  public datosObtenidos: any;

  public banderaNoResultado:boolean = false;

  currentRate = 1;

  constructor(private router: Router, configRating: NgbRatingConfig, private route: ActivatedRoute, private _tiendaServicio: TiendaServicio) {
    configRating.max = 5;
    configRating.readonly = true;
  }

  ngOnInit() {
    this.palabraBuscada = this.route.snapshot.params.palabraBuscada;
    console.log(this.palabraBuscada + "HOLA ngOnInit");
    this.buscarDatos();
  }

  ngOnDestroy() {
    delete this.vectorProductos;
    delete this.palabraBuscada;
    delete this.datosObtenidos;
  }

  public noExite = 'assets/images/no-image.png';

  getImagen(pathImagen) {
    this.noExite = 'assets/images/no-image.png';
    if (pathImagen) {
      this.noExite = 'http://localhost:3977/' + pathImagen;
    }
    return this.noExite;
  }

  public onPageChange(pageNum: number): void {
    this.paginaTamano = this.datosXpagina * (pageNum - 1);
  }

  public changePagesize(num: number): void {
    this.datosXpagina = this.paginaTamano + num;
  }

  public async buscarDatos() {
    let response = await this._tiendaServicio.obtenerFiltroBusquedaTodos(this.palabraBuscada).toPromise();
    this.datosObtenidos = response.data;
    console.log('JSON JSON DATOS' + JSON.stringify(this.datosObtenidos));

    console.log(this.palabraBuscada + "HOLA ngOnInit");
    /* this.datosObtenidos[0].forEach(elemnt => {
       this.objetoDatos.push(elemnt.NOMBRE_COMERCIAL);
     })*/

      if(this.datosObtenidos[1].length > 0){
        this.banderaNoResultado = false;
        this.datosObtenidos[1].forEach((elemnt) => {
          let objProducto = {
            NOMBRE_COMERCIAL: String,
            NOMBRE_PRODUCTO: String,
            DESCRIPCION_PRODUCTO: String,
            PROMEDIO_CAL: Number,
            TOTAL_COM: Number,
            PRECIO_UNITARIO: Number,
            IMAGEN: String
          }

          objProducto.NOMBRE_COMERCIAL = elemnt.TIENDA.NOMBRE_COMERCIAL;
          objProducto.NOMBRE_PRODUCTO = elemnt.PRODUCTO.NOMBRE_PRODUCTO;
          objProducto.DESCRIPCION_PRODUCTO = elemnt.PRODUCTO.DESCRIPCION_PRODUCTO;

          if (elemnt.PRODUCTO.CALIFICACIONs.length > 0)
            objProducto.PROMEDIO_CAL = elemnt.PRODUCTO.CALIFICACIONs[0].PROMEDIO_CAL;
          else
            objProducto.PROMEDIO_CAL = null;

          if (elemnt.PRODUCTO.COMENTARIOs.length > 0)
            objProducto.TOTAL_COM = elemnt.PRODUCTO.COMENTARIOs[0].TOTAL_COM;
          else
            objProducto.TOTAL_COM = null;

          objProducto.PRECIO_UNITARIO = elemnt.PRODUCTO.VARIANTEs[0].PRECIO_UNITARIO;
          objProducto.IMAGEN = elemnt.PRODUCTO.VARIANTEs[0].IMAGEN_PRODUCTOs[0].IMAGEN;
          this.vectorProductos.push(objProducto);
          console.log("forech" + JSON.stringify(objProducto));
        })
      }else{
        this.banderaNoResultado = true;
      }

    console.log("ooooooo" + JSON.stringify(this.vectorProductos));
  }
}
