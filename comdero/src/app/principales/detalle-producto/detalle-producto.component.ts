import {Component, Input, OnInit} from '@angular/core';
import {ProductoServicio} from "../../servicios/producto.servicio";
import {ActivatedRoute} from "@angular/router";
import Swal from "sweetalert2";
import {NgbRatingConfig} from "@ng-bootstrap/ng-bootstrap";
import {GLOBAL} from "../../servicios/global";
import {DomSanitizer} from "@angular/platform-browser";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AgenteServicio} from "../../servicios/agente.servicio";
import {DpaServicio} from "../../servicios/dpa.servicio";
import {Agente} from "../../modelos/agente";
import {ToastrService} from "ngx-toastr";
import * as moment from 'moment';
import {CarritoServicio} from "../../servicios/carrito.servicio";
import {MenuComponent} from "../menu/menu.component";
import {Carrito_Producto} from "../../modelos/carrito_producto";
import {CompraServicio} from "../../servicios/compra.servicio";
import {ICreateOrderRequest, IPayPalConfig} from "ngx-paypal";

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})

export class DetalleProductoComponent implements OnInit {
  private emailPattern: any = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$";
  public soloLetrasPattern: any = "[ a-zA-ZÑñáéíóúÁÉÍÓÚ ][ a-zA-ZÑñáéíóúÁÉÍÓÚ ]*$[0-9]{0}";
  private LetrasNumerosPattern: any = "[ .aA-zZ 0-9 ][ .aA-zZ 0-9 ]*$";
  private soloNumerosPattern: any = "[0-9][0-9]*$[A-Z]{0}";

  public identidadComprador;
  @Input() id_Producto: any;
  public productoDetalle: any;
  public resultadoProductoFiltro: any;
  public existeColor: boolean = true;
  public existeTalla: boolean = true;
  public existeMaterial: boolean = true;
  public banderaNoDisponible: boolean = false;
  public banderaDireccionEnvio: boolean = false;
  public direccionEnvioDiferente: boolean = false;
  public datosfacturacionDiferente: boolean = false;
  public siguienteDetallePedido: boolean = false;

  public varianteActiva = {
    COLOR: null,
    TALLA: null,
    MATERIAL: null,
    PRECIO_UNITARIO_CON_IVA: null,
    PRECIO_UNITARIO_CON_IVA_DESCUENTO: null,
    PRECIO_UNITARIO: null,
    STOCK: null,
    MEDIDA: null,
    IMAGENES: [],
    CANTIDAD: 1,
    ID_PRODUCTO: null,
    COD_PRODUCTO: null,
    NUM_VARIANTE: null,
    OPCION_ENVIO: [],
    METODO_PAGO: [],
    PORCENTAJE_IMPUESTO: null
  };

  public informacionCompra = {
    COD_AGENTE: null,
    ID_AGENTE: null,
    ID_PRODUCTO: null,
    COD_PRODUCTO: null,
    FECHA_COMPRA: null,
    DATOS_ENTREGA: {
      TIPO_IDENTIFICACION_ENTREGA: null,
      NOMBRE_PERSONA_ENVIO_ENTREGA: null,
      IDENTIFICACION_ENTREGA: null,
      TELEFONO_ENTREGA: null,
      CALLE_PRINCIPAL_ENTREGA: null,
      CALLE_SECUNDARIA_ENTREGA: null,
      NUM_CASA_ENTREGA: null,
      COD_DPA_ENTREGA: null,
      NUM_COD_POSTAL_ENTREGA: null,
    },
    DATOS_FACTURA: {
      TIPO_IDENTIFICACION_FACTURA: null,
      NOMBRE_FACTURA: null,
      CORREO: null,
      IDENTIFICACION_FACTURA: null,
      TELEFONO_FACTURA: null,
      DIRECCION_FACTURA: null,
    },
    CANTIDAD: null,
    NUM_VARIANTE: null,
    METODO_PAGO_COMPRA: null,
    METODO_ENVIO_COMPRA: null,
    COSTOS: {
      PRECIO_UNITARIO_PRODUCTO: null,
      TOTAL_PRODUCTOS: null,
      IMPUESTOS: null,
      PORCENTAJE_IMPUESTO: null,
      SUBTOTAL: null,
      DESCUENTOS: null,
      PORCENTAJE_AUTOMATICO: null,
      CUPON: null,
      PORCENTAJE_CUPON: null,
      RECARGO_PAYPAL: null,
      PORCENTAJE_RECARGO_PAYPAL: null,
      COSTOS_ENVIO: null,
      TOTAL_PEDIDO: null
    }
  };

  public currentRate = 1;
  public provinciasDireccion;
  public ciudadesDireccion;
  public ciudadDireccion;
  public provinciaDireccion;
  public select_ciudad: boolean = false;
  public Carrito_Producto;

  constructor(public menu: MenuComponent, public _carritoServicio: CarritoServicio, public _compraServicio: CompraServicio,
              public toastr: ToastrService, private _dpaServicio: DpaServicio, private _agenteServicio: AgenteServicio, private modalService: NgbModal, private _sanitizer: DomSanitizer, configRating: NgbRatingConfig, private route: ActivatedRoute, private _productoServicio: ProductoServicio) {
    configRating.max = 5;
    configRating.readonly = true;
    this.varianteActiva.CANTIDAD = 1;
  }

  public contactoWhatsapp;

  ngOnInit() {
    this.imagenPrincipal = 'assets/images/no-imagen1.png';
    this.getDpaProvincias("P");
    this.obtenerProducto();
  }

  async getDpaProvincias(buscar) {
    try {
      let response = await this._dpaServicio.getDpaProvincias(buscar).toPromise();
      this.provinciasDireccion = response.data;
    } catch (e) {
      console.log("error:" + JSON.stringify((e).error.message));
    }
  }

  public activarSelectDireccion: boolean = false;

  async getDpaCiudades(buscar) {
    try {
      this.activarSelectDireccion = true;
      this.ciudadDireccion = null;
      let response = await this._dpaServicio.getDpaCiudades(buscar).toPromise();
      this.ciudadesDireccion = response.data;
    } catch (e) {
      console.log("error:" + JSON.stringify((e).error.message));
    }
  }

  async seleccionarCiudad(event) {
    this.select_ciudad = false;
    this.DatosDireccion.Ciudad = event;
  }

  public banderaTipo: boolean;
  public banderaTipoEntrega: boolean;

  public cambiarTipo(value) {
    this.DatosFactura.Tipo = value;
    if (value == 'Persona') {
      this.banderaTipo = true;
    } else if (value == 'Empresa') {
      this.banderaTipo = false;
    }
  }

  public cambiarTipoEntrega(value) {
    this.DatosDireccion.Tipo = value;
    if (value == 'Persona') {
      this.banderaTipoEntrega = true;
    } else if (value == 'Empresa') {
      this.banderaTipoEntrega = false;
    }
  }

  public async obtenerProducto() {
    try {
      this.id_Producto = this.route.snapshot.params.idProducto;
      let response = await this._productoServicio.obtenerProductoDetalle(this.id_Producto).toPromise();
      this.productoDetalle = response.data;
      let contacto = this.productoDetalle.TIENDA.CONTACTO_WHATSAPP.slice(1, 10);
      this.contactoWhatsapp = '593' + contacto;
      console.log('PROUCTO OBTENIDO BD' + JSON.stringify(this.productoDetalle));
      this.existeColorMaterialTalla();
      this.asignarVariblePrimero();
      this.informacionPagoEnvio();
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
      if (variante.COLOR == '' || variante.COLOR == null) {
        totalColor = totalColor + 1;
      }

      if (variante.MATERIAL == '' || variante.MATERIAL == null) {
        totalMaterial = totalMaterial + 1;
      }

      if (variante.TALLA == '' || variante.TALLA == null) {
        totalTalla = totalTalla + 1;
      }
    })

    if (totalColor == this.productoDetalle.PRODUCTO.VARIANTEs.length)
      this.existeColor = false;

    if (totalMaterial == this.productoDetalle.PRODUCTO.VARIANTEs.length)
      this.existeMaterial = false;

    if (totalTalla == this.productoDetalle.PRODUCTO.VARIANTEs.length)
      this.existeTalla = false;
  }

  public valueColor: any = null;
  public valueMaterial: any = null;
  public valueTalla: any = null;
  public valueAuxMaterial: any = null;
  public valueAuxTalla: any = null;
  public data = {
    video: null,
    type: null
  };

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

    this.varianteActiva.PORCENTAJE_IMPUESTO = this.productoDetalle.IVA;
    let IVA = (this.productoDetalle.PRODUCTO.VARIANTEs[0].PRECIO_UNITARIO * this.productoDetalle.IVA) / 100;
    this.varianteActiva.PRECIO_UNITARIO_CON_IVA = this.productoDetalle.PRODUCTO.VARIANTEs[0].PRECIO_UNITARIO + IVA;
    this.varianteActiva.PRECIO_UNITARIO = this.productoDetalle.PRODUCTO.VARIANTEs[0].PRECIO_UNITARIO;
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

    this.varianteActiva.ID_PRODUCTO = this.productoDetalle.PRODUCTO.ID_PRODUCTO;
    this.varianteActiva.COD_PRODUCTO = this.productoDetalle.PRODUCTO.COD_PRODUCTO;
    this.varianteActiva.NUM_VARIANTE = this.productoDetalle.PRODUCTO.VARIANTEs[0].NUM_VARIANTE;
    this.varianteActiva.OPCION_ENVIO = this.productoDetalle.TIENDA.OPCION_ENVIOs;
    this.varianteActiva.METODO_PAGO = this.productoDetalle.TIENDA.METODO_PAGOs;

    console.log('VARIANTE ACTIVA' + JSON.stringify(this.varianteActiva));
    this.selectVariables();
    this.buscarDescuentoAutomatico();
  }

  public arrayColor = new Set();
  public arrayTalla = new Set();
  public arrayMaterial = new Set();

  public selectVariables() {
    this.productoDetalle.PRODUCTO.VARIANTEs.forEach(variante => {
      this.arrayColor.add(variante.COLOR);
      this.arrayTalla.add(variante.TALLA);
      this.arrayMaterial.add(variante.MATERIAL);
    })
    console.log(JSON.stringify(this.arrayColor.size) + "COLOR" + "TALLA" + "MATERIAL");
  }

  public banderaActivarDescuentoAutomatico: boolean = false;
  public porcentajeDescuento = 0;

  public buscarDescuentoAutomatico() {
    this.banderaActivarDescuentoAutomatico = false;
    this.porcentajeDescuento = 0;
    this.varianteActiva.PRECIO_UNITARIO_CON_IVA_DESCUENTO = 0;
    let fechaHoy = moment().format("YYYY-MM-DD");
    let horaActual = moment().format("HH:mm:ss");
    console.log('horaHoy' + horaActual + fechaHoy)
    if (this.productoDetalle.PRODUCTO.PRODUCTO_DESCUENTOs.length > 0) {
      this.productoDetalle.PRODUCTO.PRODUCTO_DESCUENTOs.forEach(descuentoAut => {
        if (descuentoAut.DESCUENTO.TIPO_DESCUENTO == 'Automático') {
          if (descuentoAut.DESCUENTO.FECHA_INICIO == fechaHoy) {
            if ((this.obtenerMinutos(horaActual) >= this.obtenerMinutos(descuentoAut.DESCUENTO.HORA_INICIO))) {
              //CUPON VALIDO
              this.porcentajeDescuento = this.porcentajeDescuento + descuentoAut.DESCUENTO.PORCENTAJE_DESCUENTO;
              this.banderaActivarDescuentoAutomatico = true;
              console.log('1XX' + horaActual + fechaHoy)
            }
          } else {
            if (descuentoAut.DESCUENTO.FECHA_FIN == fechaHoy) {
              if ((this.obtenerMinutos(horaActual) <= this.obtenerMinutos(descuentoAut.DESCUENTO.HORA_FIN))) {
                //CUPON VALIDO
                this.porcentajeDescuento = this.porcentajeDescuento + descuentoAut.DESCUENTO.PORCENTAJE_DESCUENTO;
                this.banderaActivarDescuentoAutomatico = true;
                console.log('2XX' + horaActual + fechaHoy);
              } else {
                this.porcentajeDescuento = this.porcentajeDescuento + 0;
                this.banderaActivarDescuentoAutomatico = false;
              }
            } else {
              //CUPON VALIDO
              this.porcentajeDescuento = this.porcentajeDescuento + descuentoAut.DESCUENTO.PORCENTAJE_DESCUENTO;
              this.banderaActivarDescuentoAutomatico = true;
              console.log('3XX' + horaActual + fechaHoy);
            }
          }
        }
      })
    } else {
      this.porcentajeDescuento = null;
      this.varianteActiva.PRECIO_UNITARIO_CON_IVA_DESCUENTO = null;
      this.banderaActivarDescuentoAutomatico = false;
    }
    this.varianteActiva.PRECIO_UNITARIO_CON_IVA_DESCUENTO = this.varianteActiva.PRECIO_UNITARIO_CON_IVA - ((this.varianteActiva.PRECIO_UNITARIO_CON_IVA * this.porcentajeDescuento) / 100);
    console.log(this.varianteActiva.PRECIO_UNITARIO_CON_IVA_DESCUENTO + 'PRECIO DESCUENTO' + this.porcentajeDescuento + 'DESCUENTO');
  }

  public obtenerMinutos(hora) {
    if (hora) {
      var spl = hora.split(":");
      return parseInt(spl[0]) * 60 + parseInt(spl[1]);
    }
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
      this.varianteActiva.COLOR = this.valueColor;
      this.varianteActiva.TALLA = this.valueTalla;
      this.varianteActiva.MATERIAL = this.valueMaterial;

      let IVA = (this.resultadoProductoFiltro[0].PRECIO_UNITARIO * this.productoDetalle.IVA) / 100;
      this.varianteActiva.PRECIO_UNITARIO_CON_IVA = this.resultadoProductoFiltro[0].PRECIO_UNITARIO + IVA;
      this.varianteActiva.PRECIO_UNITARIO = this.resultadoProductoFiltro[0].PRECIO_UNITARIO;
      this.buscarDescuentoAutomatico();

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

      this.varianteActiva.CANTIDAD = 1;
      this.varianteActiva.ID_PRODUCTO = this.productoDetalle.PRODUCTO.ID_PRODUCTO;
      this.varianteActiva.COD_PRODUCTO = this.productoDetalle.PRODUCTO.COD_PRODUCTO;
      this.varianteActiva.NUM_VARIANTE = this.resultadoProductoFiltro[0].NUM_VARIANTE;
      console.log('VARIANTE NUEVA' + JSON.stringify(this.resultadoProductoFiltro));
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
    if (this.varianteActiva.CANTIDAD >= this.varianteActiva.STOCK)
      this.varianteActiva.CANTIDAD = this.varianteActiva.STOCK;
    else
      this.varianteActiva.CANTIDAD = this.varianteActiva.CANTIDAD + 1;
  }

  public decrementar() {
    if (this.varianteActiva.CANTIDAD <= 1)
      this.varianteActiva.CANTIDAD = 1;
    else
      this.varianteActiva.CANTIDAD = this.varianteActiva.CANTIDAD - 1;
  }


  public DatosDireccion;
  public DatosFactura;
  public ciudadDireccionNombre;
  public provinciaDireccionNombre;

  public abrirModalFinalizarPedido(content) {

    this.verificarMetodosTienda();
    this.identidadComprador = this._agenteServicio.getIdentity();
    console.log('AGENTE' + JSON.stringify(this.identidadComprador));

    //DATOS DE COMPRA QUE PUEDEN NO ESTAR
    if (this.identidadComprador.ID_AGENTE != null) {
      console.log('SI HAY DIRECCION');
      this.DatosDireccion = new Agente(this.identidadComprador.ID_AGENTE, this.identidadComprador.NUM_COD_POSTAL, this.identidadComprador.NOMBRE,
        this.identidadComprador.TELEFONO, null, this.identidadComprador.TIPO, 0, this.identidadComprador.CALLE_PRINCIPAL_AGENTE,
        this.identidadComprador.CALLE_SECUNDARIA_AGENTE, this.identidadComprador.NUM_CASA_AGENTE, null, this.identidadComprador.COD_DPA,
        null);

      this.DatosFactura = new Agente(this.identidadComprador.ID_AGENTE, null, this.identidadComprador.NOMBRE,
        this.identidadComprador.TELEFONO, this.identidadComprador.CORREO, this.identidadComprador.TIPO, 0,
        this.identidadComprador.CALLE_PRINCIPAL_AGENTE + ' ' + this.identidadComprador.CALLE_SECUNDARIA_AGENTE + ',' + this.identidadComprador.DPA.NOMBRE + ',' + this.identidadComprador.DPA.DPAP.NOMBRE,
        null, null, null, null, null);

      this.informacionCompra.ID_AGENTE = this.identidadComprador.ID_AGENTE;


      this.informacionCompra.DATOS_ENTREGA.TIPO_IDENTIFICACION_ENTREGA = this.identidadComprador.TIPO;
      this.informacionCompra.DATOS_ENTREGA.IDENTIFICACION_ENTREGA = this.identidadComprador.ID_AGENTE;
      this.informacionCompra.DATOS_ENTREGA.CALLE_PRINCIPAL_ENTREGA = this.identidadComprador.CALLE_PRINCIPAL_AGENTE;
      this.informacionCompra.DATOS_ENTREGA.CALLE_SECUNDARIA_ENTREGA = this.identidadComprador.CALLE_SECUNDARIA_AGENTE;
      this.informacionCompra.DATOS_ENTREGA.NUM_CASA_ENTREGA = this.identidadComprador.NUM_CASA_AGENTE;
      this.informacionCompra.DATOS_ENTREGA.COD_DPA_ENTREGA = this.identidadComprador.COD_DPA;
      this.informacionCompra.DATOS_ENTREGA.NOMBRE_PERSONA_ENVIO_ENTREGA = this.identidadComprador.NOMBRE;
      this.informacionCompra.DATOS_ENTREGA.NUM_COD_POSTAL_ENTREGA = this.identidadComprador.NUM_COD_POSTAL;
      this.informacionCompra.DATOS_ENTREGA.TELEFONO_ENTREGA = this.identidadComprador.TELEFONO;
      this.ciudadDireccionNombre = this.identidadComprador.DPA.NOMBRE;
      this.provinciaDireccionNombre = this.identidadComprador.DPA.DPAP.NOMBRE;

      this.informacionCompra.DATOS_FACTURA.TIPO_IDENTIFICACION_FACTURA = this.identidadComprador.TIPO;
      this.informacionCompra.DATOS_FACTURA.NOMBRE_FACTURA = this.identidadComprador.NOMBRE;
      this.informacionCompra.DATOS_FACTURA.CORREO = this.identidadComprador.CORREO;
      this.informacionCompra.DATOS_FACTURA.IDENTIFICACION_FACTURA = this.identidadComprador.ID_AGENTE;
      this.informacionCompra.DATOS_FACTURA.TELEFONO_FACTURA = this.identidadComprador.TELEFONO;
      this.informacionCompra.DATOS_FACTURA.DIRECCION_FACTURA = this.identidadComprador.CALLE_PRINCIPAL_AGENTE + ' ' + this.identidadComprador.CALLE_SECUNDARIA_AGENTE + ',' + this.identidadComprador.DPA.NOMBRE + ',' + this.identidadComprador.DPA.DPAP.NOMBRE;

    } else {
      //NO TIENE AGREGADA LA DIRECCION
      this.DatosDireccion = new Agente(null, null, this.identidadComprador.NOMBRE,
        null, null, null, 0, null,
        null, null, null, null,
        null);

      this.DatosFactura = new Agente(null, null, this.identidadComprador.NOMBRE,
        null, this.identidadComprador.CORREO, this.identidadComprador.TIPO, 0,
        null, null, null, null, null, null);

      this.informacionCompra.ID_AGENTE = null;

      this.informacionCompra.DATOS_ENTREGA.TIPO_IDENTIFICACION_ENTREGA = null;
      this.informacionCompra.DATOS_ENTREGA.IDENTIFICACION_ENTREGA = null;
      this.informacionCompra.DATOS_ENTREGA.CALLE_PRINCIPAL_ENTREGA = null;
      this.informacionCompra.DATOS_ENTREGA.CALLE_SECUNDARIA_ENTREGA = null;
      this.informacionCompra.DATOS_ENTREGA.NUM_CASA_ENTREGA = null;
      this.informacionCompra.DATOS_ENTREGA.COD_DPA_ENTREGA = null;
      this.informacionCompra.DATOS_ENTREGA.NOMBRE_PERSONA_ENVIO_ENTREGA = this.identidadComprador.NOMBRE;
      this.informacionCompra.DATOS_ENTREGA.NUM_COD_POSTAL_ENTREGA = null;
      this.informacionCompra.DATOS_ENTREGA.TELEFONO_ENTREGA = null;
      this.ciudadDireccionNombre = null;
      this.provinciaDireccionNombre = null;

      this.informacionCompra.DATOS_FACTURA.TIPO_IDENTIFICACION_FACTURA = this.identidadComprador.TIPO;
      this.informacionCompra.DATOS_FACTURA.NOMBRE_FACTURA = this.identidadComprador.NOMBRE;
      this.informacionCompra.DATOS_FACTURA.CORREO = this.identidadComprador.CORREO;
      this.informacionCompra.DATOS_FACTURA.IDENTIFICACION_FACTURA = null;
      this.informacionCompra.DATOS_FACTURA.TELEFONO_FACTURA = null;
      this.informacionCompra.DATOS_FACTURA.DIRECCION_FACTURA = null;

    }

    //DATOS DE COMPRA QUE SIEMPRE HABRA
    this.informacionCompra.COD_AGENTE = this.identidadComprador.COD_AGENTE;
    this.informacionCompra.ID_PRODUCTO = this.varianteActiva.ID_PRODUCTO;
    this.informacionCompra.COD_PRODUCTO = this.varianteActiva.COD_PRODUCTO;
    this.informacionCompra.FECHA_COMPRA = moment().format("YYYY-MM-DD");

    this.informacionCompra.CANTIDAD = this.varianteActiva.CANTIDAD;
    this.informacionCompra.NUM_VARIANTE = this.varianteActiva.NUM_VARIANTE;
    console.log('VARIANTE' + this.informacionCompra.NUM_VARIANTE);
    this.informacionCompra.METODO_PAGO_COMPRA = null;
    this.informacionCompra.METODO_ENVIO_COMPRA = null;

    this.informacionCompra.COSTOS.PRECIO_UNITARIO_PRODUCTO = this.varianteActiva.PRECIO_UNITARIO;
    this.informacionCompra.COSTOS.TOTAL_PRODUCTOS = (this.varianteActiva.CANTIDAD * this.varianteActiva.PRECIO_UNITARIO); //Buscar descuento y menorar
    this.informacionCompra.COSTOS.IMPUESTOS = (this.informacionCompra.COSTOS.TOTAL_PRODUCTOS * this.varianteActiva.PORCENTAJE_IMPUESTO) / 100;
    this.informacionCompra.COSTOS.PORCENTAJE_IMPUESTO = this.varianteActiva.PORCENTAJE_IMPUESTO;
    this.informacionCompra.COSTOS.SUBTOTAL = this.informacionCompra.COSTOS.TOTAL_PRODUCTOS + this.informacionCompra.COSTOS.IMPUESTOS;

    if (this.banderaActivarDescuentoAutomatico == true) {
      this.informacionCompra.COSTOS.DESCUENTOS = ((this.informacionCompra.COSTOS.SUBTOTAL * this.porcentajeDescuento) / 100);
      this.informacionCompra.COSTOS.PORCENTAJE_AUTOMATICO = this.porcentajeDescuento;
    } else {
      this.informacionCompra.COSTOS.DESCUENTOS = 0;
      this.informacionCompra.COSTOS.PORCENTAJE_AUTOMATICO = 0;
    }
    //cupones
    this.informacionCompra.COSTOS.CUPON = 0;
    this.informacionCompra.COSTOS.PORCENTAJE_CUPON = 0;


    this.informacionCompra.COSTOS.PORCENTAJE_RECARGO_PAYPAL = 0;


    this.informacionCompra.COSTOS.COSTOS_ENVIO = 0;
    this.informacionCompra.COSTOS.TOTAL_PEDIDO = (this.informacionCompra.COSTOS.SUBTOTAL + this.informacionCompra.COSTOS.RECARGO_PAYPAL + this.informacionCompra.COSTOS.COSTOS_ENVIO) - (this.informacionCompra.COSTOS.DESCUENTOS + this.informacionCompra.COSTOS.CUPON);
    console.log('VARIANTE COMPRAS' + JSON.stringify(this.informacionCompra));
    //FIN DATOS DE COMPRA
    this.modalService.open(content, {centered: true, size: 'lg', backdrop: "static"});
  }

  public mostrarTiendaEnvioRetiro: boolean = false;
  public mostrarTiendaEnvioDomicilio: boolean = false;
  public mostrarTiendaPagoEfectivo: boolean = false;
  public mostrarTiendaPagoTransferencia: boolean = false;
  public mostrarTiendaPagoElectronico: boolean = false;

  public instruccion_retiro: String;
  public hora_estimada_retiro: String;
  public Banco_Pertenece: String;
  public Tipo_Cuenta: String;
  public Numero_cuenta: String;

  public verificarMetodosTienda() {
    this.varianteActiva.OPCION_ENVIO.forEach(envio => {
      if (envio.TIPO_ENVIO == 'Retiro') {
        this.mostrarTiendaEnvioRetiro = true;
        this.instruccion_retiro = envio.INSTRUCCION_RETIRO;
        this.hora_estimada_retiro = envio.HORA_ESTIMADA_RETIRO;
      }
      if (envio.TIPO_ENVIO == 'Domicilio') {
        this.mostrarTiendaEnvioDomicilio = true;
      }
    })

    this.varianteActiva.METODO_PAGO.forEach(pago => {
      if (pago.TIPO_PAGO == 'Efectivo') {
        this.mostrarTiendaPagoEfectivo = true;
      }
      if (pago.TIPO_PAGO == 'Transferencia') {
        this.mostrarTiendaPagoTransferencia = true;
        this.Banco_Pertenece = pago.BANCO_PERTENECE;
        this.Tipo_Cuenta = pago.TIPO_CUENTA;
        this.Numero_cuenta = pago.NUMERO_CUENTA;
      }
      if (pago.TIPO_PAGO == 'Electrónico') {
        this.mostrarTiendaPagoElectronico = true;
      }
    })
  }

  public selectMetodoEnvio(event) {
    this.banderaDireccionEnvio = false;
    this.noExisteEnvioEstaArea = false;
    this.informacionCompra.METODO_ENVIO_COMPRA = event.target.value;
    this.informacionCompra.METODO_PAGO_COMPRA = null
    this.informacionCompra.COSTOS.RECARGO_PAYPAL = 0;
    this.banderaRecargoPaypal = false;
    this.informacionCompra.COSTOS.COSTOS_ENVIO = 0;
    if (event.target.value == 'Domicilio') {
      this.banderaDireccionEnvio = true;
      this.calcularCostosEnvioDomicilio();
    }
    this.informacionCompra.COSTOS.TOTAL_PEDIDO = (this.informacionCompra.COSTOS.SUBTOTAL + this.informacionCompra.COSTOS.RECARGO_PAYPAL + this.informacionCompra.COSTOS.COSTOS_ENVIO) - (this.informacionCompra.COSTOS.DESCUENTOS + this.informacionCompra.COSTOS.CUPON);
  }

  public banderaRecargoPaypal: boolean = false;

  public selectMetodoPago(event) {
    this.banderaRecargoPaypal = false;
    this.informacionCompra.COSTOS.RECARGO_PAYPAL = 0;
    this.informacionCompra.METODO_PAGO_COMPRA = event.target.value;
    this.informacionCompra.COSTOS.PORCENTAJE_RECARGO_PAYPAL=0;
    if (event.target.value == 'Electrónico') {

      this.varianteActiva.METODO_PAGO.forEach(pago => {
        if (pago.TIPO_PAGO == 'Electrónico') {
          this.informacionCompra.COSTOS.PORCENTAJE_RECARGO_PAYPAL = pago.PORCENTAJE_RECARGO;
        }
      });
      this.banderaRecargoPaypal = true;
      this.informacionCompra.COSTOS.RECARGO_PAYPAL = (this.informacionCompra.COSTOS.SUBTOTAL * this.informacionCompra.COSTOS.PORCENTAJE_RECARGO_PAYPAL) / 100;
      this.initConfig();
      if (this.informacionCompra.METODO_ENVIO_COMPRA == 'Domicilio') {
        this.calcularCostosEnvioDomicilio();
      }
    }
    this.informacionCompra.COSTOS.TOTAL_PEDIDO = (this.informacionCompra.COSTOS.SUBTOTAL + this.informacionCompra.COSTOS.RECARGO_PAYPAL + this.informacionCompra.COSTOS.COSTOS_ENVIO) - (this.informacionCompra.COSTOS.DESCUENTOS + this.informacionCompra.COSTOS.CUPON);
  }

  public habilitarDireccionDiferente(proceso) {
    if (proceso == 'Envio') {
      this.activarSelectDireccion = false;
      this.direccionEnvioDiferente = !this.direccionEnvioDiferente;
      this.ciudadDireccion = null;
      this.provinciaDireccion = null;
      this.DatosDireccion.Id_Agente = this.informacionCompra.DATOS_ENTREGA.IDENTIFICACION_ENTREGA;
      this.DatosDireccion.Tipo = this.informacionCompra.DATOS_ENTREGA.TIPO_IDENTIFICACION_ENTREGA;
      this.DatosDireccion.Num_Cod_Postal = this.informacionCompra.DATOS_ENTREGA.NUM_COD_POSTAL_ENTREGA;
      this.DatosDireccion.Nombre = this.informacionCompra.DATOS_ENTREGA.NOMBRE_PERSONA_ENVIO_ENTREGA;
      this.DatosDireccion.Telefono = this.informacionCompra.DATOS_ENTREGA.TELEFONO_ENTREGA;
      this.DatosDireccion.Calle_Principal_Agente = this.informacionCompra.DATOS_ENTREGA.CALLE_PRINCIPAL_ENTREGA;
      this.DatosDireccion.Calle_Secundaria_Agente = this.informacionCompra.DATOS_ENTREGA.CALLE_SECUNDARIA_ENTREGA;
      this.DatosDireccion.Num_Casa_Agente = this.informacionCompra.DATOS_ENTREGA.NUM_CASA_ENTREGA;
      this.DatosDireccion.Ciudad = this.informacionCompra.DATOS_ENTREGA.COD_DPA_ENTREGA;

      if (this.DatosDireccion.Tipo == 'Persona') {
        this.banderaTipoEntrega = true;
      } else if (this.DatosFactura.Tipo == 'Empresa') {
        this.banderaTipoEntrega = false;
      }

    }
    if (proceso == 'Factura') {
      this.datosfacturacionDiferente = !this.datosfacturacionDiferente;

      this.DatosFactura.Id_Agente = this.informacionCompra.DATOS_FACTURA.IDENTIFICACION_FACTURA;
      this.DatosFactura.Tipo = this.informacionCompra.DATOS_FACTURA.TIPO_IDENTIFICACION_FACTURA;
      this.DatosFactura.Nombre = this.informacionCompra.DATOS_FACTURA.NOMBRE_FACTURA;
      this.DatosFactura.Telefono = this.informacionCompra.DATOS_FACTURA.TELEFONO_FACTURA;
      this.DatosFactura.Calle_Principal_Agente = this.informacionCompra.DATOS_FACTURA.DIRECCION_FACTURA;
      this.DatosFactura.Correo = this.informacionCompra.DATOS_FACTURA.CORREO;

      if (this.DatosFactura.Tipo == 'Persona') {
        this.banderaTipo = true;
      } else if (this.DatosFactura.Tipo == 'Empresa') {
        this.banderaTipo = false;
      }
    }
  }

  public siguienteProcesoCompra() {
    console.log('COMPRA' + JSON.stringify(this.informacionCompra));
    if (this.informacionCompra.METODO_ENVIO_COMPRA != null && this.informacionCompra.METODO_PAGO_COMPRA != null) {
      if (!this.noExisteEnvioEstaArea) {
        if (this.banderaDireccionEnvio && this.informacionCompra.DATOS_ENTREGA.CALLE_PRINCIPAL_ENTREGA == null && !this.noExisteEnvioEstaArea) {
          this.mostrarToast("Ingrese la dirección de envío, para continuar con la compra.", "");
        } else {
          if (this.informacionCompra.DATOS_FACTURA.IDENTIFICACION_FACTURA != null) {
            console.log('DATOS DE COMPRA A ENVIO' + JSON.stringify(this.informacionCompra));
            this.siguienteDetallePedido = !this.siguienteDetallePedido;
          } else {
            this.mostrarToast("Ingrese los datos de facturación para continuar con la compra.", "");
          }
        }
      } else {
        this.mostrarToast("Usted puede seleccionar 'Acordar con el vendedor' para continuar con su compra a esta zona.", "");
      }
    } else {
      this.mostrarToast("Es importante que seleccione el método de envío y pago antes de continuar con la compra.", "");
    }
  }

  public guardarDireccionNueva() {
    if (document.forms['formActualizarDireccionEnvio'].checkValidity()) {
      if (this.validarCedulaEntrega() == true) {
        this.informacionCompra.DATOS_ENTREGA.TIPO_IDENTIFICACION_ENTREGA = this.DatosDireccion.Tipo;
        this.informacionCompra.DATOS_ENTREGA.IDENTIFICACION_ENTREGA = this.DatosDireccion.Id_Agente;

        this.informacionCompra.DATOS_ENTREGA.CALLE_PRINCIPAL_ENTREGA = this.DatosDireccion.Calle_Principal_Agente;
        this.informacionCompra.DATOS_ENTREGA.CALLE_SECUNDARIA_ENTREGA = this.DatosDireccion.Calle_Secundaria_Agente;
        this.informacionCompra.DATOS_ENTREGA.NUM_CASA_ENTREGA = this.DatosDireccion.Num_Casa_Agente;
        this.informacionCompra.DATOS_ENTREGA.COD_DPA_ENTREGA = this.DatosDireccion.Ciudad.toString().trim();

        this.provinciasDireccion.forEach(provincia => {
          if (provincia.COD_DPA == this.provinciaDireccion)
            this.provinciaDireccionNombre = provincia.NOMBRE;
        })
        console.log(JSON.stringify(this.provinciasDireccion));
        this.ciudadesDireccion.forEach(ciudad => {
          if (ciudad.COD_DPA == this.DatosDireccion.Ciudad.toString().trim()) {
            this.ciudadDireccionNombre = ciudad.NOMBRE;
          }
        })
        console.log(JSON.stringify(this.ciudadesDireccion) + this.ciudadDireccion + this.DatosDireccion.Ciudad);
        this.informacionCompra.DATOS_ENTREGA.NOMBRE_PERSONA_ENVIO_ENTREGA = this.DatosDireccion.Nombre;
        this.informacionCompra.DATOS_ENTREGA.NUM_COD_POSTAL_ENTREGA = this.DatosDireccion.Num_Cod_Postal;
        this.informacionCompra.DATOS_ENTREGA.TELEFONO_ENTREGA = this.DatosDireccion.Telefono;

        console.log('DDDDDDDDDDDDDDDDD' + this.informacionCompra.DATOS_ENTREGA.COD_DPA_ENTREGA + 'DDDDDDDDDDDD');

        this.banderaDireccionEnvio = true;
        this.calcularCostosEnvioDomicilio();
        this.direccionEnvioDiferente = !this.direccionEnvioDiferente;

      } else {
        if (this.banderaTipoEntrega) {
          this.mostrarToast("La cédula ingresada no es válida", "");
        } else if (!this.banderaTipoEntrega) {
          this.mostrarToast("El ruc ingresado no es válido", "");
        }
      }
    } else {
      this.mostrarToast("Al parecer existe errores en su formulario por favor revise nuevamente, debe llenar todos los campos obligatorios (*)", "");
    }
  }

  public guardarFacturacionNueva() {
    if (document.forms['formActualizarDatosFacturacion'].checkValidity()) {
      if (this.validarCedula() == true) {
        this.informacionCompra.DATOS_FACTURA.IDENTIFICACION_FACTURA = this.DatosFactura.Id_Agente;
        this.informacionCompra.DATOS_FACTURA.NOMBRE_FACTURA = this.DatosFactura.Nombre;
        this.informacionCompra.DATOS_FACTURA.TIPO_IDENTIFICACION_FACTURA = this.DatosFactura.Tipo;
        this.informacionCompra.DATOS_FACTURA.TELEFONO_FACTURA = this.DatosFactura.Telefono;
        this.informacionCompra.DATOS_FACTURA.DIRECCION_FACTURA = this.DatosFactura.Calle_Principal_Agente;
        this.informacionCompra.DATOS_FACTURA.CORREO = this.DatosFactura.Correo;
        this.datosfacturacionDiferente = !this.datosfacturacionDiferente;
      } else {
        if (this.banderaTipo) {
          this.mostrarToast("La cédula ingresada no es válida", "");
        } else if (!this.banderaTipo) {
          this.mostrarToast("El ruc ingresado no es válido", "");
        }
      }
    } else {
      this.mostrarToast("Al parecer existe errores en su formulario por favor revise nuevamente, debe llenar todos los campos obligatorios (*)", "");
    }
  }

  public validarCedulaEntrega() {
    var cad: any = this.DatosDireccion.Id_Agente;
    var i;
    var total = 0;
    var longitud;
    if (this.DatosDireccion.Tipo == 'Persona')
      longitud = cad.length;
    else
      longitud = cad.length - 3;

    var longcheck = longitud - 1;
    if (cad !== "" && longitud === 10) {
      for (i = 0; i < longcheck; i++) {
        if (i % 2 === 0) {
          var aux = cad.charAt(i) * 2;
          if (aux > 9) aux -= 9;
          total += aux;
        } else {
          total += parseInt(cad.charAt(i)); // parseInt o concatenará en lugar de sumar
        }
      }
      total = total % 10 ? 10 - total % 10 : 0;

      if (cad.charAt(longitud - 1) == total) {
        return true;
      } else {
        this.DatosDireccion.Id_Agente = null;
        return false;
      }
    }
  }


  public validarCedula() {
    var cad: any = this.DatosFactura.Id_Agente;
    var i;
    var total = 0;
    var longitud;
    if (this.DatosFactura.Tipo == 'Persona')
      longitud = cad.length;
    else
      longitud = cad.length - 3;

    var longcheck = longitud - 1;
    if (cad !== "" && longitud === 10) {
      for (i = 0; i < longcheck; i++) {
        if (i % 2 === 0) {
          var aux = cad.charAt(i) * 2;
          if (aux > 9) aux -= 9;
          total += aux;
        } else {
          total += parseInt(cad.charAt(i)); // parseInt o concatenará en lugar de sumar
        }
      }
      total = total % 10 ? 10 - total % 10 : 0;

      if (cad.charAt(longitud - 1) == total) {
        return true;
      } else {
        this.DatosFactura.Id_Agente = null;
        return false;
      }
    }
  }

  public mostrarToast(mensaje, icono) {
    this.toastr.error('<div class="row no-gutters"><p class="col-12 LetrasToastInfo"><strong>!Error</strong><br>' + mensaje + '</p> </div>', "",
      {positionClass: 'toast-top-right', enableHtml: true, closeButton: true});
  }

  public cerrar() {
    this.mostrarTiendaEnvioRetiro = false;
    this.mostrarTiendaEnvioDomicilio = false;
    this.mostrarTiendaPagoEfectivo = false;
    this.mostrarTiendaPagoTransferencia = false;
    this.mostrarTiendaPagoElectronico = false;

    this.instruccion_retiro = null;
    this.hora_estimada_retiro = null;
    this.Banco_Pertenece = null;
    this.Tipo_Cuenta = null;
    this.Numero_cuenta = null;

    this.DatosDireccion = null;
    this.DatosFactura = null;
    this.ciudadDireccionNombre = null;
    this.provinciaDireccionNombre = null;

    this.identidadComprador = null;
    this.DatosDireccion = null;
    this.DatosFactura = null;

    this.arrayCuponNombres = new Set();
    this.banderaRecargoPaypal = false;
    this.bandCuponActivado = false;
    this.banCuponUtilizado = false;
    this.noExisteEnvioEstaArea = false;
    this.direccionEnvioDiferente = false;
    this.datosfacturacionDiferente = false;
    this.siguienteDetallePedido = false;
    this.banderaDireccionEnvio = false;
    this.informacionCompra = {
      COD_AGENTE: null,
      ID_AGENTE: null,
      ID_PRODUCTO: null,
      COD_PRODUCTO: null,
      FECHA_COMPRA: null,
      DATOS_ENTREGA: {
        TIPO_IDENTIFICACION_ENTREGA: null,
        NOMBRE_PERSONA_ENVIO_ENTREGA: null,
        IDENTIFICACION_ENTREGA: null,
        TELEFONO_ENTREGA: null,
        CALLE_PRINCIPAL_ENTREGA: null,
        CALLE_SECUNDARIA_ENTREGA: null,
        NUM_CASA_ENTREGA: null,
        COD_DPA_ENTREGA: null,
        NUM_COD_POSTAL_ENTREGA: null,
      },
      DATOS_FACTURA: {
        TIPO_IDENTIFICACION_FACTURA: null,
        NOMBRE_FACTURA: null,
        CORREO: null,
        IDENTIFICACION_FACTURA: null,
        TELEFONO_FACTURA: null,
        DIRECCION_FACTURA: null,
      },
      CANTIDAD: null,
      NUM_VARIANTE: null,
      METODO_PAGO_COMPRA: null,
      METODO_ENVIO_COMPRA: null,
      COSTOS: {
        PRECIO_UNITARIO_PRODUCTO: null,
        TOTAL_PRODUCTOS: null,
        IMPUESTOS: null,
        PORCENTAJE_IMPUESTO: null,
        SUBTOTAL: null,
        DESCUENTOS: null,
        PORCENTAJE_AUTOMATICO: null,
        CUPON: null,
        PORCENTAJE_CUPON: null,
        RECARGO_PAYPAL: null,
        PORCENTAJE_RECARGO_PAYPAL: null,
        COSTOS_ENVIO: null,
        TOTAL_PEDIDO: null
      }
    };

    console.log(this.DatosDireccion + this.DatosFactura + JSON.stringify(this.informacionCompra));
  }

  public atras() {
    this.siguienteDetallePedido = !this.siguienteDetallePedido;
  }

  public objEfectivo = {
    Tipo_Pago: null,
    Descuento: null
  };
  public objElectronico = {
    Tipo_Pago: null,
    Recargo: null
  };
  public objTransferencia = {
    Tipo_Pago: null,
    Descuento: null,
    Tipo_Cuenta: null,
    Banco_Pertenece: null,
    Numero_cuenta: null
  };

  public informacionPagoEnvio() {
    this.objEfectivo = {
      Tipo_Pago: null,
      Descuento: 0
    };
    this.objElectronico = {
      Tipo_Pago: null,
      Recargo: 0
    };
    this.objTransferencia = {
      Tipo_Pago: null,
      Descuento: 0,
      Tipo_Cuenta: null,
      Banco_Pertenece: null,
      Numero_cuenta: null
    };

    this.productoDetalle.TIENDA.METODO_PAGOs.forEach(pago => {
      if (pago.TIPO_PAGO == 'Efectivo') {
        this.objEfectivo.Tipo_Pago = pago.TIPO_PAGO;
        this.objEfectivo.Descuento = pago.PORCENTAJE_DESCUENTO
      }

      if (pago.TIPO_PAGO == 'Transferencia') {
        this.objTransferencia.Tipo_Pago = pago.TIPO_PAGO;
        this.objTransferencia.Descuento = pago.PORCENTAJE_DESCUENTO;
        this.objTransferencia.Tipo_Cuenta = pago.TIPO_CUENTA;
        this.objTransferencia.Banco_Pertenece = pago.BANCO_PERTENECE;
        this.objTransferencia.Numero_cuenta = pago.NUMERO_CUENTA;
      }

      if (pago.TIPO_PAGO == 'Electrónico') {
        this.objElectronico.Tipo_Pago = pago.TIPO_PAGO;
        this.objElectronico.Recargo = pago.PORCENTAJE_RECARGO;
      }
    })
  }


  public async agregarCarrito() {
    try {
      this.Carrito_Producto = new Carrito_Producto(this.varianteActiva.NUM_VARIANTE, this.varianteActiva.CANTIDAD, this.varianteActiva.IMAGENES[0].IMAGEN);
      let response = await this._carritoServicio.saveCarrito(this.Carrito_Producto).toPromise();
      this.menu.conteoProductosCarrito(true);
    } catch (e) {
      console.log("error:" + JSON.stringify((e)));
      this.toastr.error(JSON.stringify((e.error.message)))
    }
  }

  public cuponDescuentoNombre = null;
  public arrayCuponNombres = new Set();
  public bandCuponActivado: boolean = false;
 public banCuponUtilizado:boolean=false;
  public aplicarCuponDescuento() {
    this.bandCuponActivado = false;
    this.banCuponUtilizado = false;

    if (this.arrayCuponNombres.size > 0) {
      for (var nombresCupon of this.arrayCuponNombres) {
        if (nombresCupon == this.cuponDescuentoNombre)
          this.banCuponUtilizado = true;
      }
    }

    let fechaHoyCupon = moment().format("YYYY-MM-DD");
    let horaActualCupon = moment().format("HH:mm:ss");
    let contadorCupones = 0;
    if (this.productoDetalle.PRODUCTO.PRODUCTO_DESCUENTOs.length > 0) {
      if (this.bandCuponActivado == false) {
        this.productoDetalle.PRODUCTO.PRODUCTO_DESCUENTOs.forEach(descuentoCupon => {
          if (descuentoCupon.DESCUENTO.TIPO_DESCUENTO == 'Cupón' && descuentoCupon.DESCUENTO.MOTIVO_DESCUENTO == this.cuponDescuentoNombre) {
            if (descuentoCupon.DESCUENTO.FECHA_INICIO == fechaHoyCupon) {
              if ((this.obtenerMinutos(horaActualCupon) >= this.obtenerMinutos(descuentoCupon.DESCUENTO.HORA_INICIO))) {
                //CUPON VALIDO
                this.bandCuponActivado = false;
                this.informacionCompra.COSTOS.PORCENTAJE_CUPON = this.informacionCompra.COSTOS.PORCENTAJE_CUPON + descuentoCupon.DESCUENTO.PORCENTAJE_DESCUENTO;
                this.arrayCuponNombres.add(this.cuponDescuentoNombre);
                console.log('1CUPON' + horaActualCupon + fechaHoyCupon);
              }
            } else {
              if (descuentoCupon.DESCUENTO.FECHA_FIN == fechaHoyCupon) {
                if ((this.obtenerMinutos(horaActualCupon) <= this.obtenerMinutos(descuentoCupon.DESCUENTO.HORA_FIN))) {
                  //CUPON VALIDO
                  this.bandCuponActivado = false;
                  this.arrayCuponNombres.add(this.cuponDescuentoNombre);
                  this.informacionCompra.COSTOS.PORCENTAJE_CUPON = this.informacionCompra.COSTOS.PORCENTAJE_CUPON + descuentoCupon.DESCUENTO.PORCENTAJE_DESCUENTO;
                  console.log('2CUPON' + horaActualCupon + fechaHoyCupon);
                } else {
                  contadorCupones += 1;
                  this.informacionCompra.COSTOS.PORCENTAJE_CUPON = this.informacionCompra.COSTOS.PORCENTAJE_CUPON + 0;
                  console.log('1NO VALIDO' + horaActualCupon + fechaHoyCupon);
                }
              } else {
                //CUPON VALIDO
                this.bandCuponActivado = false;
                this.arrayCuponNombres.add(this.cuponDescuentoNombre);
                this.informacionCompra.COSTOS.PORCENTAJE_CUPON = this.informacionCompra.COSTOS.PORCENTAJE_CUPON + descuentoCupon.DESCUENTO.PORCENTAJE_DESCUENTO;
                console.log('3CUPON' + horaActualCupon + fechaHoyCupon);
              }
            }
          } else {
            contadorCupones += 1;
          }
        })
      }
      if (contadorCupones == this.productoDetalle.PRODUCTO.PRODUCTO_DESCUENTOs.length) {
        this.bandCuponActivado = true;
      }
      this.informacionCompra.COSTOS.CUPON = ((this.informacionCompra.COSTOS.SUBTOTAL * this.informacionCompra.COSTOS.PORCENTAJE_CUPON) / 100);
      this.cuponDescuentoNombre = null;
    } else {
      //NO EXISTEN CUPONES
      this.bandCuponActivado = true;
      this.informacionCompra.COSTOS.CUPON = 0;
      this.informacionCompra.COSTOS.PORCENTAJE_CUPON = 0;
    }

    this.informacionCompra.COSTOS.TOTAL_PEDIDO = (this.informacionCompra.COSTOS.SUBTOTAL + this.informacionCompra.COSTOS.RECARGO_PAYPAL + this.informacionCompra.COSTOS.COSTOS_ENVIO) - (this.informacionCompra.COSTOS.DESCUENTOS + this.informacionCompra.COSTOS.CUPON);

  }

  public arrayPreciosEnvioAux = [];
  public pesoPedidoTotalKg = 0;
  public noExisteEnvioEstaArea: boolean = false;

  public calcularCostosEnvioDomicilio() {
    let Costo_Comparativo = ((this.informacionCompra.COSTOS.SUBTOTAL + this.informacionCompra.COSTOS.RECARGO_PAYPAL) - (this.informacionCompra.COSTOS.DESCUENTOS + this.informacionCompra.COSTOS.CUPON))
    console.log('VALOR A COMPRAR CON TODO ' + Costo_Comparativo);
    let localExisteUno = 'No Existe Local';
    let restoExisteUno = 'No Existe Resto';
    this.arrayPreciosEnvioAux = [];
    this.pesoPedidoTotalKg = this.productoDetalle.PRODUCTO.PESO_PRODUCTO * this.informacionCompra.CANTIDAD;

    if (this.informacionCompra.DATOS_ENTREGA.CALLE_PRINCIPAL_ENTREGA != null) {
      let banderaEncontroDireccion: boolean = false;
      for (let opSucursales of this.productoDetalle.TIENDA.SUCURSALs) {
        if (opSucursales.DPA.COD_DPA == this.informacionCompra.DATOS_ENTREGA.COD_DPA_ENTREGA && banderaEncontroDireccion == false) {
          //ENCONTRE UN DIRECCION QUE COINCIDE ES LOCAL
          console.log('//ENCONTRE UN DIRECCION QUE COINCIDE ES LOCAL');
          banderaEncontroDireccion = true;
        }
      }

      if (banderaEncontroDireccion == true) {
        //ENVIO LOCAL

        this.varianteActiva.OPCION_ENVIO.forEach(envioDomicilio => {
          if (envioDomicilio.TIPO_UBICACION == 'Local') {
            localExisteUno = 'Existe Local';


            if (envioDomicilio.TIPO_MEDIDA == 'Precio') {
              //DE ACUERDO AL PRECIO DEL PEDIDO
              console.log('//DE ACUERDO AL PRECIO DEL PEDIDO');
              if (Costo_Comparativo >= envioDomicilio.MINIMO && Costo_Comparativo <= envioDomicilio.MAXIMO) {
                this.arrayPreciosEnvioAux.push(envioDomicilio.PRECIO);
              }
            }
            if (envioDomicilio.TIPO_MEDIDA == 'Peso') {
              //DE ACUERDO AL PESO DEL PEDIDO
              console.log('//DE ACUERDO AL PESO DEL PEDIDO');
              if (this.pesoPedidoTotalKg >= envioDomicilio.MINIMO && this.pesoPedidoTotalKg <= envioDomicilio.MAXIMO) {
                this.arrayPreciosEnvioAux.push(envioDomicilio.PRECIO);
              }
            }


          }
        })

        console.log('/ENVIO LOCAL');
      } else {
        //FUERA DE LA CIUDAD
        this.varianteActiva.OPCION_ENVIO.forEach(envioDomicilio => {
          if (envioDomicilio.TIPO_UBICACION == 'Resto') {

            restoExisteUno = 'Existe Resto';

            if (envioDomicilio.TIPO_MEDIDA == 'Precio') {
              //DE ACUERDO AL PRECIO DEL PEDIDO
              console.log('//DE ACUERDO AL PRECIO DEL PEDIDO');
              if (Costo_Comparativo >= envioDomicilio.MINIMO && Costo_Comparativo <= envioDomicilio.MAXIMO) {
                this.arrayPreciosEnvioAux.push(envioDomicilio.PRECIO);
              }
            }

            if (envioDomicilio.TIPO_MEDIDA == 'Peso') {
              //DE ACUERDO AL PESO DEL PEDIDO
              console.log('//DE ACUERDO AL PESO DEL PEDIDO');
              if (this.pesoPedidoTotalKg >= envioDomicilio.MINIMO && this.pesoPedidoTotalKg <= envioDomicilio.MAXIMO) {
                this.arrayPreciosEnvioAux.push(envioDomicilio.PRECIO);
              }
            }
          }
        })
        console.log('//FUERA DE LA CIUDAD');
      }

      let precioFinalEntregaMenor = 0;
      if (this.arrayPreciosEnvioAux.length > 0) {
        //HAY COINCIDENCIAS DE COSTOS DE ENVIO

        precioFinalEntregaMenor = this.arrayPreciosEnvioAux[0]; //Así empezamos a comparar
        for (let i = 0; i < this.arrayPreciosEnvioAux.length; i++) {
          if (this.arrayPreciosEnvioAux[i] < precioFinalEntregaMenor) {
            precioFinalEntregaMenor = this.arrayPreciosEnvioAux[i];
          }
        }
        this.noExisteEnvioEstaArea = false;
        console.log('PRECIO MENOR' + precioFinalEntregaMenor);
      } else {
        if (localExisteUno == 'No Existe Local' && restoExisteUno == 'No Existe Resto') {
          //MANDAR MENSAJE DE NO EXISTE EL ENVIO A ESA ZONA.
          this.noExisteEnvioEstaArea = true;
          console.log('//MANDAR MENSAJE DE NO EXISTE EL ENVIO A ESA ZONA.');
        } else {
          //NO HAY COINCIDENCIAS DE COSTOS DE ENVIO
          console.log('//NO HAY COINCIDENCIAS DE COSTOS DE ENVIO');
          this.noExisteEnvioEstaArea = false;
          precioFinalEntregaMenor = 0;
        }
      }

      this.informacionCompra.COSTOS.COSTOS_ENVIO = precioFinalEntregaMenor;
      console.log('=======================' + precioFinalEntregaMenor);
      console.log('+++++++++++++++++++++++' + this.arrayPreciosEnvioAux);
      console.log('COMPRA A ENVIAR COSOTOS DOMICILIO' + this.informacionCompra.COSTOS.COSTOS_ENVIO);
    } else {
      //DIRECCION DE ENTREGA ESTA VACIO.
    }
    this.informacionCompra.COSTOS.TOTAL_PEDIDO = (this.informacionCompra.COSTOS.SUBTOTAL + this.informacionCompra.COSTOS.RECARGO_PAYPAL + this.informacionCompra.COSTOS.COSTOS_ENVIO) - (this.informacionCompra.COSTOS.DESCUENTOS + this.informacionCompra.COSTOS.CUPON);
  }

  public async comprar() {
    try {
      if(this.informacionCompra.METODO_PAGO_COMPRA=="Electrónico"){

      }else {
      console.log('INFORMACION COMPRA' + JSON.stringify(this.informacionCompra));
      let response = await this._compraServicio.saveComprarProducto(this.informacionCompra).toPromise();
      this.mensageCorrecto(response.message);
      }
    } catch (e) {
      console.log("error", e);
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
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
  public payPalConfig: IPayPalConfig;
  initConfig() {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'Ae5SlhhgQC33YtMTKt0VJV-DlqFVJvWXGSzJNWRDGJLMolNPW_ppiGCy30nSyNlzv521TGmcXTeCuqiW',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',

        payer:{
          name:{
            given_name:'stteffano',
            surname:"Aguayo"
          },
          address: {
            address_line_1: '123 ABC Street',
            address_line_2: 'Apt 2',
            postal_code: '95121',
            country_code: 'EC',
            admin_area_2: 'Riobamba',
          },
          email_address: "tefo.aguayo@gmail.com",

        },

        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: '0.02',
              /*  breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: '0.02'
                  }
                }*/
            },


          }
        ],

      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
        color:'blue',
        size:'small',
        shape:'pill',


      },

      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
  mensageCorrecto(mensaje) {
    Swal.fire({
      icon: 'success',
      title: '<header class="login100-form-title-registro"><h5 class="card-title">!Correcto..</h5></header>',
      html: mensaje,
      position: 'center',
      width: 600,
      buttonsStyling: false,
      //footer: '<a href="http://localhost:4200/loguin"><b><u>Autentificate Ahora</u></b></a>',
      customClass: {
        confirmButton: 'btn btn-primary px-5',
        //icon:'sm'
      }
    });
  }
}
