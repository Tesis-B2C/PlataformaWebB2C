import {Component, Input, OnInit } from '@angular/core';
import {ProductoServicio} from "../../servicios/producto.servicio";
import {ActivatedRoute} from "@angular/router";
import Swal from "sweetalert2";
import {NgbRatingConfig} from "@ng-bootstrap/ng-bootstrap";
import {GLOBAL} from "../../servicios/global";
import {DomSanitizer} from "@angular/platform-browser";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AgenteServicio} from "../../servicios/agente.servicio";

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})

export class DetalleProductoComponent implements OnInit {
  public identidadComprador;
  @Input() id_Producto: any;
  public productoDetalle: any;
  public resultadoProductoFiltro: any;
  public existeColor: boolean = true;
  public existeTalla: boolean = true;
  public existeMaterial: boolean = true;
  public banderaNoDisponible: boolean = false;

  public varianteActiva = {
    COLOR: String,
    TALLA: String,
    MATERIAL: String,
    PRECIO_UNITARIO: Number,
    STOCK: Number,
    MEDIDA: String,
    IMAGENES: [],
    CANTIDAD: Number = 1
  };

  public ej = 87;

  currentRate = 1;
  public arrayColor = new Set();
  public arrayTalla = new Set();
  public arrayMaterial = new Set();
  public data = {
    video: null,
    type: null
  };

  public valueColor: any = null;
  public valueMaterial: any = null;
  public valueTalla: any = null;
  public valueAuxMaterial: any;
  public valueAuxTalla: any;

  constructor(private _agenteServicio: AgenteServicio, private modalService: NgbModal, private _sanitizer: DomSanitizer, configRating: NgbRatingConfig, private route: ActivatedRoute, private _productoServicio: ProductoServicio) {
    configRating.max = 5;
    configRating.readonly = true;
  }

  ngOnInit() {
    this.obtenerProducto();
  }

  public async obtenerProducto() {
    try {
      this.id_Producto = this.route.snapshot.params.idProducto;
      let response = await this._productoServicio.obtenerProductoDetalle(this.id_Producto).toPromise();
      this.productoDetalle = response.data;
      console.log('PROUCTO OBTENIDO BD' + JSON.stringify(this.productoDetalle));
      this.existeColorMaterialTalla();
      this.asignarVariblePrimero();
    } catch (e) {
      console.log("error:" + e);
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
    }
  }

  public existeColorMaterialTalla() {
    let totalColor = 0;
    let totalMaterial = 0;
    let totalTalla = 0;

    this.productoDetalle.PRODUCTO.VARIANTEs.forEach(variante => {
      if (variante.COLOR == '' || variante.COLOR == null)
        totalColor = totalColor + 1;

      if (variante.MATERIAL == '' || variante.MATERIAL == null)
        totalMaterial = totalMaterial + 1;

      if (variante.TALLA == '' || variante.TALLA == null)
        totalTalla = totalTalla + 1;
    })

    if (totalColor == this.productoDetalle.PRODUCTO.VARIANTEs.length)
      this.existeColor = false;

    if (totalMaterial == this.productoDetalle.PRODUCTO.VARIANTEs.length)
      this.existeMaterial = false;

    if (totalTalla == this.productoDetalle.PRODUCTO.VARIANTEs.length)
      this.existeTalla = false;
  }

  public asignarVariblePrimero() {
    if (this.existeColor == true) {
      this.varianteActiva.COLOR = this.productoDetalle.PRODUCTO.VARIANTEs[0].COLOR;
      this.valueColor = this.varianteActiva.COLOR;
    }
    if (this.existeTalla == true) {
      this.varianteActiva.TALLA = this.productoDetalle.PRODUCTO.VARIANTEs[0].TALLA;
    }

    if (this.existeMaterial == true) {
      this.varianteActiva.MATERIAL = this.productoDetalle.PRODUCTO.VARIANTEs[0].MATERIAL;
    }

    let IVA = (this.productoDetalle.PRODUCTO.VARIANTEs[0].PRECIO_UNITARIO * this.productoDetalle.IVA) / 100;
    this.varianteActiva.PRECIO_UNITARIO = this.productoDetalle.PRODUCTO.VARIANTEs[0].PRECIO_UNITARIO + IVA;

    this.varianteActiva.STOCK = this.productoDetalle.PRODUCTO.VARIANTEs[0].STOCK;
    this.varianteActiva.MEDIDA = this.productoDetalle.PRODUCTO.VARIANTEs[0].MEDIDA;
    this.varianteActiva.IMAGENES = this.productoDetalle.PRODUCTO.VARIANTEs[0].IMAGEN_PRODUCTOs;

    this.imagenPrincipal = GLOBAL.urlImagen + this.varianteActiva.IMAGENES[0].IMAGEN;
    this.varianteActiva.IMAGENES.forEach(imagen => {
      if (imagen.TIPO_IMAGEN == 'youtube') {
        this.getVideoIframeInicio(imagen.IMAGEN);
      }
      if (imagen.TIPO_IMAGEN == 'video') {
        this.data.video = imagen.IMAGEN;
        this.data.type = imagen.TIPO_IMAGEN;
      }
    })
    console.log('VARIANTE ACTIVA' + JSON.stringify(this.varianteActiva));
    this.selectVariables();
  }

  public selectVariables() {
    this.productoDetalle.PRODUCTO.VARIANTEs.forEach(variante => {
      this.arrayColor.add(variante.COLOR);
      this.arrayTalla.add(variante.TALLA);
      this.arrayMaterial.add(variante.MATERIAL);
    })
    console.log(JSON.stringify(this.arrayColor.size) + "COLOR" + "TALLA" + "MATERIAL");
  }

  public verificarVariante() {
    this.valueMaterial = null;
    this.valueTalla = null;

    if (this.existeTalla == true) {
      this.valueAuxTalla = document.getElementById('tallaSelect') as HTMLElement;
      this.valueTalla = this.valueAuxTalla.value;
    }

    if (this.existeMaterial == true) {
      this.valueAuxMaterial = document.getElementById('materialSelect') as HTMLElement;
      this.valueMaterial = this.valueAuxMaterial.value;
    }

    console.log("COLORCITO" + this.valueMaterial + 'x' + this.valueTalla + 'xx' + this.valueColor);

    this.resultadoProductoFiltro = this.productoDetalle.PRODUCTO.VARIANTEs.filter(variante =>
      (variante.TALLA == this.valueTalla) && (variante.MATERIAL == this.valueMaterial) && (variante.COLOR == this.valueColor)
    );
    console.log('SOY LO QUE ECNONTRE' + JSON.stringify(this.resultadoProductoFiltro));
    this.asignarVariableCambio();
  }

  public asignarVariableCambio() {
    if (this.resultadoProductoFiltro.length > 0) {
      this.banderaNoDisponible = false;
      this.varianteActiva.CANTIDAD = 1;
      this.varianteActiva.COLOR = this.valueColor;
      this.varianteActiva.TALLA = this.valueTalla;
      this.varianteActiva.MATERIAL = this.valueMaterial;

      let IVA = (this.resultadoProductoFiltro[0].PRECIO_UNITARIO * this.productoDetalle.IVA) / 100;
      this.varianteActiva.PRECIO_UNITARIO = this.resultadoProductoFiltro[0].PRECIO_UNITARIO + IVA;

      this.varianteActiva.STOCK = this.resultadoProductoFiltro[0].STOCK;
      this.varianteActiva.MEDIDA = this.resultadoProductoFiltro[0].MEDIDA;

      if (this.resultadoProductoFiltro[0].IMAGEN_PRODUCTOs.length > 0) {
        this.varianteActiva.IMAGENES = this.resultadoProductoFiltro[0].IMAGEN_PRODUCTOs;
        this.imagenPrincipal = GLOBAL.urlImagen + this.varianteActiva.IMAGENES[0].IMAGEN;
        this.varianteActiva.IMAGENES.forEach(imagen => {
          if (imagen.TIPO_IMAGEN == 'youtube') {
            this.getVideoIframeInicio(imagen.IMAGEN);
          }
          if (imagen.TIPO_IMAGEN == 'video') {
            this.data.video = imagen.IMAGEN;
            this.data.type = imagen.TIPO_IMAGEN;
          }
        })
        console.log('VARIANTE SEGUNDA VEZ' + JSON.stringify(this.varianteActiva));
      }
      console.log('NUMERO DE IMAGENES' + JSON.stringify(this.varianteActiva));
    } else {
      this.banderaNoDisponible = true;
    }
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
public holatefo = '';
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
    this.videoYoutube = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);
  }

  public incrementar() {
    if (this.varianteActiva.CANTIDAD  >= this.varianteActiva.STOCK)
      this.varianteActiva.CANTIDAD  = this.varianteActiva.STOCK;
    else {
      this.varianteActiva.CANTIDAD  = this.varianteActiva.CANTIDAD  + 1;
    }
  }

  public decrementar() {
    if (this.varianteActiva.CANTIDAD  <= 1)
      this.varianteActiva.CANTIDAD  = 1;
    else {
      this.varianteActiva.CANTIDAD  = this.varianteActiva.CANTIDAD  - 1;
    }
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

  public abrirModalFinalizarPedido(content) {
    this.identidadComprador = this._agenteServicio.getIdentity();
    console.log('AGENTE' + JSON.stringify(this.identidadComprador));
    this.modalService.open(content, {centered: true, size: 'lg'});
  }

}
