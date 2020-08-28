import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ProductoServicio} from "../../servicios/producto.servicio";
import {ActivatedRoute} from "@angular/router";
import Swal from "sweetalert2";
import {NgbRatingConfig} from "@ng-bootstrap/ng-bootstrap";
import {GLOBAL} from "../../servicios/global";
import {DomSanitizer} from "@angular/platform-browser";

function groupBy(objectArray, property) {
  return objectArray.reduce(function (acc, obj) {
    var key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})

export class DetalleProductoComponent implements OnInit, OnDestroy {
  @Input() id_Producto: any;
  public productoDetalle: any;
  public contador = 1;
  public grupoColores = [];
  public resultadoProductoFiltro: any;

  public varianteActiva = {
    COLOR: String,
    TALLA: String,
    MATERIAL: String,
    PRECIO_UNITARIO: Number,
    STOCK: Number,
    MEDIDA: String,
    IMAGENES: []
  };

  currentRate = 1;

  constructor(public _sanitizer: DomSanitizer, configRating: NgbRatingConfig, public route: ActivatedRoute, public _productoServicio: ProductoServicio) {
    configRating.max = 5;
    configRating.readonly = true;
  }

  ngOnInit() {
    this.obtenerProducto();
  }

  ngOnDestroy() {
    delete this.arrayColor;
    delete this.arrayTalla;
    delete this.arrayMaterial;
    delete this.productoDetalle;
  }

  public arrayColor = new Set();
  public arrayTalla = new Set();
  public arrayMaterial = new Set();
  public data = {
    video:null,
    type:null
  };
  public async obtenerProducto() {
    try {
      this.id_Producto = this.route.snapshot.params.idProducto;
      let response = await this._productoServicio.obtenerProductoDetalle(this.id_Producto).toPromise();
      this.productoDetalle = response.data;
      console.log('PROUCTO OBTENIDO BD' + JSON.stringify(this.productoDetalle));
      this.varianteActiva.COLOR = this.productoDetalle.PRODUCTO.VARIANTEs[0].COLOR;
      this.varianteActiva.TALLA = this.productoDetalle.PRODUCTO.VARIANTEs[0].TALLA;
      this.varianteActiva.MATERIAL = this.productoDetalle.PRODUCTO.VARIANTEs[0].MATERIAL;
      this.varianteActiva.PRECIO_UNITARIO = this.productoDetalle.PRODUCTO.VARIANTEs[0].PRECIO_UNITARIO;
      this.varianteActiva.STOCK = this.productoDetalle.PRODUCTO.VARIANTEs[0].STOCK;
      this.varianteActiva.MEDIDA = this.productoDetalle.PRODUCTO.VARIANTEs[0].MEDIDA;
      this.varianteActiva.IMAGENES = this.productoDetalle.PRODUCTO.VARIANTEs[0].IMAGEN_PRODUCTOs;

      this.imagenPrincipal =  GLOBAL.urlImagen + this.varianteActiva.IMAGENES[0].IMAGEN;
      this.varianteActiva.IMAGENES.forEach(imagen => {
        if(imagen.TIPO_IMAGEN == 'youtube' ){
         this.getVideoIframeInicio(imagen.IMAGEN);
        }
        if(imagen.TIPO_IMAGEN == 'video' ){
          this.data.video = imagen.IMAGEN;
          this.data.type = imagen.TIPO_IMAGEN;
        }
      })


      console.log('VARIANTE ACTIVA' + JSON.stringify(this.varianteActiva));
      this.selectVariables();
    } catch (e) {
      console.log("error:" + e);
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
    }
  }

  public selectVariables() {
    this.productoDetalle.PRODUCTO.VARIANTEs.forEach(variante => {
      this.arrayColor.add(variante.COLOR);
      this.arrayTalla.add(variante.TALLA);
      this.arrayMaterial.add(variante.MATERIAL);
    })
  }

  public valueColor: any;
  public valueMaterial: any;
  public valueTalla: any;

  public verificarVariante() {
    this.valueTalla = document.getElementById('tallaSelect') as HTMLElement;
    this.valueMaterial = document.getElementById('materialSelect') as HTMLElement;
    console.log("COLORCITO" + this.valueMaterial.value + 'x' + this.valueTalla.value + 'xx' + this.valueColor);
    this.resultadoProductoFiltro = this.productoDetalle.PRODUCTO.VARIANTEs.filter(variante =>
      (variante.TALLA == this.valueTalla.value) && (variante.MATERIAL == this.valueMaterial.value) && (variante.COLOR == this.valueColor)
    );

    console.log('RESULTADO' + JSON.stringify(this.resultadoProductoFiltro));
  }

  public asignarColor(color) {
    this.valueColor = color;
    console.log(this.valueColor + 'ESTE ES MI COLOR');
    this.verificarVariante();
  }

  public imagenPrincipal;

  public asignarImgPrincipal(pathImagen) {
    this.imagenPrincipal = 'assets/images/no-imagen1.png';
    if (pathImagen) {
      this.imagenPrincipal = GLOBAL.urlImagen + pathImagen;
    }
  }

  public noExite = 'assets/images/no-imagen1.png';

  getImagen(pathImagen) {
    this.noExite = 'assets/images/no-imagen1.png';
    if (pathImagen) {
      this.noExite = GLOBAL.urlImagen + pathImagen;
    }
    return this.noExite;
  }

  public videoYoutube;


  public getVideoIframeInicio(direccionVideoYoutube) {
    let url = direccionVideoYoutube;
    var video, results;

    if (url === null) {
      return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    video = (results === null) ? url : results[1];
    //delete this.videoPorGuardar;
    this.videoYoutube = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);
    // delete this.videoPorGuardar;
  }

  public incrementar() {
    if (this.contador == 3)
      alert('Maximo permitido alcanzado: 3');
    else {
      this.contador = this.contador + 1;
    }
  }

  public decrementar() {
    if (this.contador == 1)
      alert('Minimo permitido alcanzado: 0');
    else {
      this.contador = this.contador - 1;
    }
  }

  public agruparColor() {
    this.grupoColores = groupBy(this.productoDetalle.PRODUCTO.VARIANTEs, 'COLOR');
    console.log('COLORES AGRUPADOS' + JSON.stringify(this.grupoColores) + this.grupoColores);
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
