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
import { formatNumber } from '@angular/common';

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
    PRECIO_UNITARIO: null,
    STOCK: null,
    MEDIDA: null,
    IMAGENES: [],
    CANTIDAD: null,
    ID_PRODUCTO: null,
    COD_PRODUCTO: null,
    NUM_VARIANTE: null,
    OPCION_ENVIO: [],
    METODO_PAGO: [],
    PORCENTAJE_IMPUESTO: null,
  };

  public informacionCompra = {
    COD_AGENTE: null,
    ID_AGENTE: null,
    ID_PRODUCTO: null,
    COD_PRODUCTO: null,
    FECHA_COMPRA: null,
    DATOS_ENTREGA: {
      CALLE_PRINCIPAL_ENTREGA: null,
      CALLE_SECUNDARIA_ENTREGA: null,
      NUM_CASA_ENTREGA: null,
      COD_DPA_ENTREGA: null,
      NOMBRE_PERSONA_ENVIO_ENTREGA: null,
      NUM_COD_POSTAL_ENTREGA: null,
      TELEFONO_ENTREGA: null,
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
      RECARGO_PAYPAL: null,
      PORCENTAJE_RECARGO_PAYPAL: null,
      TOTAL_PEDIDO: null,
    }
  };

  currentRate = 1;

  public provinciasDireccion;
  public ciudadesDireccion;
  public ciudadDireccion;
  public provinciaDireccion;
  public select_ciudad: boolean = false;

  constructor(public toastr: ToastrService, private _dpaServicio: DpaServicio, private _agenteServicio: AgenteServicio, private modalService: NgbModal, private _sanitizer: DomSanitizer, configRating: NgbRatingConfig, private route: ActivatedRoute, private _productoServicio: ProductoServicio) {
    configRating.max = 5;
    configRating.readonly = true;
  }

  ngOnInit() {
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

  public cambiarTipo(value) {
    this.DatosFactura.Tipo = value;
    if (value == 'Persona') {
      this.banderaTipo = true;
    } else if (value == 'Empresa') {
      this.banderaTipo = false;
    }
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

  public buscarDescuentoAutomatico() {
    let fechaHoy = moment().format("YYYY-MM-DD");
    let horaActual = moment().format("HH:mm:ss");
    console.log('horaHoy' + horaActual + fechaHoy)
    if (this.productoDetalle.PRODUCTO.PRODUCTO_DESCUENTOs.length > 0) {
      this.productoDetalle.PRODUCTO.PRODUCTO_DESCUENTOs.forEach(descuentoAut => {
        if (descuentoAut.DESCUENTO.TIPO_DESCUENTO == 'Automático') {
          if (descuentoAut.DESCUENTO.FECHA_INICIO == fechaHoy) {
            if ((this.obtenerMinutos(horaActual) >= this.obtenerMinutos(descuentoAut.DESCUENTO.HORA_INICIO))) {
              //CUPON VALIDO
              console.log('1' + horaActual + fechaHoy)
            }
          } else {
            if (descuentoAut.DESCUENTO.FECHA_FIN == fechaHoy) {
              if ((this.obtenerMinutos(horaActual) <= this.obtenerMinutos(descuentoAut.DESCUENTO.HORA_FIN))) {
                //CUPON VALIDO
                console.log('2' + horaActual + fechaHoy)
              } else {
                this.banderaActivarDescuentoAutomatico = false;
              }
            } else {
              //CUPON VALIDO
              console.log('3' + horaActual + fechaHoy)
            }
          }
        }
      })
    } else {
      this.banderaActivarDescuentoAutomatico = false;
    }
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
      this.varianteActiva.CANTIDAD = 1;
      this.varianteActiva.COLOR = this.valueColor;
      this.varianteActiva.TALLA = this.valueTalla;
      this.varianteActiva.MATERIAL = this.valueMaterial;

      let IVA = (this.resultadoProductoFiltro[0].PRECIO_UNITARIO * this.productoDetalle.IVA) / 100;
      this.varianteActiva.PRECIO_UNITARIO_CON_IVA = this.resultadoProductoFiltro[0].PRECIO_UNITARIO + IVA;
      this.varianteActiva.PRECIO_UNITARIO = this.productoDetalle.PRODUCTO.VARIANTEs[0].PRECIO_UNITARIO;
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

  public DatosDireccion;
  public DatosFactura;
  public ciudadDireccionNombre;
  public provinciaDireccionNombre;

  public abrirModalFinalizarPedido(content) {
    this.verificarMetodosTienda();
    this.identidadComprador = this._agenteServicio.getIdentity();
    this.DatosDireccion = new Agente(null, this.identidadComprador.NUM_COD_POSTAL, this.identidadComprador.NOMBRE,
      this.identidadComprador.TELEFONO, null, null, 0, this.identidadComprador.CALLE_PRINCIPAL_AGENTE,
      this.identidadComprador.CALLE_SECUNDARIA_AGENTE, this.identidadComprador.NUM_CASA_AGENTE, null, null,
      this.identidadComprador.COD_DPA);
    console.log('DATOS DIRECCION NUEVA' + this.DatosDireccion);

    this.DatosFactura = new Agente(this.identidadComprador.ID_AGENTE, null, this.identidadComprador.NOMBRE,
      this.identidadComprador.TELEFONO, this.identidadComprador.CORREO, this.identidadComprador.TIPO, 0,
      this.identidadComprador.CALLE_PRINCIPAL_AGENTE + ' ' + this.identidadComprador.CALLE_SECUNDARIA_AGENTE + ',' + this.identidadComprador.DPA.NOMBRE + ',' + this.identidadComprador.DPA.DPAP.NOMBRE,
      null, null, null, null, null);

    //DATOS DE COMPRA
    this.informacionCompra.COD_AGENTE = this.identidadComprador.COD_AGENTE;
    this.informacionCompra.ID_AGENTE = this.identidadComprador.ID_AGENTE;
    this.informacionCompra.ID_PRODUCTO = this.varianteActiva.ID_PRODUCTO;
    this.informacionCompra.COD_PRODUCTO = this.varianteActiva.COD_PRODUCTO;
    this.informacionCompra.CANTIDAD = this.varianteActiva.CANTIDAD;
    this.informacionCompra.NUM_VARIANTE = this.varianteActiva.NUM_VARIANTE;
    //this.informacionCompra.FECHA_COMPRA = this.varianteActiva.COD_PRODUCTO;
    console.log('VARIANTE' + this.informacionCompra.NUM_VARIANTE);
    this.informacionCompra.METODO_PAGO_COMPRA = '';
    this.informacionCompra.METODO_ENVIO_COMPRA = '';

    this.informacionCompra.DATOS_ENTREGA.CALLE_PRINCIPAL_ENTREGA = this.identidadComprador.CALLE_PRINCIPAL_AGENTE;
    this.informacionCompra.DATOS_ENTREGA.CALLE_SECUNDARIA_ENTREGA = this.identidadComprador.CALLE_SECUNDARIA_AGENTE;
    this.informacionCompra.DATOS_ENTREGA.NUM_CASA_ENTREGA = this.identidadComprador.NUM_CASA_AGENTE;
    this.informacionCompra.DATOS_ENTREGA.COD_DPA_ENTREGA = this.identidadComprador.COD_DPA;
    this.ciudadDireccionNombre = this.identidadComprador.DPA.NOMBRE;
    this.provinciaDireccionNombre = this.identidadComprador.DPA.DPAP.NOMBRE;
    this.informacionCompra.DATOS_ENTREGA.NOMBRE_PERSONA_ENVIO_ENTREGA = this.identidadComprador.NOMBRE;
    this.informacionCompra.DATOS_ENTREGA.NUM_COD_POSTAL_ENTREGA = this.identidadComprador.NUM_COD_POSTAL;
    this.informacionCompra.DATOS_ENTREGA.TELEFONO_ENTREGA = this.identidadComprador.TELEFONO;

    this.informacionCompra.DATOS_FACTURA.IDENTIFICACION_FACTURA = this.identidadComprador.ID_AGENTE;
    this.informacionCompra.DATOS_FACTURA.NOMBRE_FACTURA = this.identidadComprador.NOMBRE;
    this.informacionCompra.DATOS_FACTURA.TIPO_IDENTIFICACION_FACTURA = this.identidadComprador.TIPO;
    this.informacionCompra.DATOS_FACTURA.TELEFONO_FACTURA = this.identidadComprador.TELEFONO;
    this.informacionCompra.DATOS_FACTURA.DIRECCION_FACTURA = this.identidadComprador.CALLE_PRINCIPAL_AGENTE + ' ' + this.identidadComprador.CALLE_SECUNDARIA_AGENTE + ',' + this.identidadComprador.DPA.NOMBRE + ',' + this.identidadComprador.DPA.DPAP.NOMBRE;
    this.informacionCompra.DATOS_FACTURA.CORREO = this.identidadComprador.CORREO;

    this.informacionCompra.COSTOS.PRECIO_UNITARIO_PRODUCTO = this.varianteActiva.PRECIO_UNITARIO;
    this.informacionCompra.COSTOS.TOTAL_PRODUCTOS = (this.varianteActiva.CANTIDAD * this.varianteActiva.PRECIO_UNITARIO); //Buscar descuento y menorar
    this.informacionCompra.COSTOS.PORCENTAJE_IMPUESTO = this.varianteActiva.PORCENTAJE_IMPUESTO;
    this.informacionCompra.COSTOS.IMPUESTOS = (this.informacionCompra.COSTOS.TOTAL_PRODUCTOS * this.informacionCompra.COSTOS.PORCENTAJE_IMPUESTO) / 100;
    this.informacionCompra.COSTOS.SUBTOTAL = this.informacionCompra.COSTOS.TOTAL_PRODUCTOS + this.informacionCompra.COSTOS.IMPUESTOS;

    this.varianteActiva.METODO_PAGO.forEach(pago => {
      if (pago.TIPO_PAGO == 'Electrónico') {
        this.informacionCompra.COSTOS.PORCENTAJE_RECARGO_PAYPAL = pago.PORCENTAJE_RECARGO;
        this.informacionCompra.COSTOS.RECARGO_PAYPAL = pago.PORCENTAJE_RECARGO; //Preguntar a que le hago el porcentaje de recargo
      }
    })

    //FIN DATOS DE COMPRA

    console.log('AGENTE' + JSON.stringify(this.identidadComprador));
    this.modalService.open(content, {centered: true, size: 'lg', backdrop: "static"});
  }

  public opcion_envio: String = null;
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

  selectMetodoEnvio(event) {
    this.banderaDireccionEnvio = false;
    this.informacionCompra.METODO_ENVIO_COMPRA = event.target.value;
    if (event.target.value == 'Domicilio') {
      this.banderaDireccionEnvio = true;
    }
  }

  selectMetodoPago(event) {
    this.informacionCompra.METODO_PAGO_COMPRA = event.target.value;
  }

  public habilitarDireccionDiferente(proceso) {
    if (proceso == 'Envio') {
      this.activarSelectDireccion = false;
      this.direccionEnvioDiferente = !this.direccionEnvioDiferente;
      this.ciudadDireccion = "";
      this.provinciaDireccion = "";
      this.DatosDireccion.Num_Cod_Postal = this.informacionCompra.DATOS_ENTREGA.NUM_COD_POSTAL_ENTREGA;
      this.DatosDireccion.Nombre = this.informacionCompra.DATOS_ENTREGA.NOMBRE_PERSONA_ENVIO_ENTREGA;
      this.DatosDireccion.Telefono = this.informacionCompra.DATOS_ENTREGA.TELEFONO_ENTREGA;
      this.DatosDireccion.Calle_Principal_Agente = this.informacionCompra.DATOS_ENTREGA.CALLE_PRINCIPAL_ENTREGA;
      this.DatosDireccion.Calle_Secundaria_Agente = this.informacionCompra.DATOS_ENTREGA.CALLE_SECUNDARIA_ENTREGA;
      this.DatosDireccion.Num_Casa_Agente = this.informacionCompra.DATOS_ENTREGA.NUM_CASA_ENTREGA;
      this.DatosDireccion.Provincia = this.informacionCompra.DATOS_ENTREGA.COD_DPA_ENTREGA;
    }
    if (proceso == 'Factura') {
      this.datosfacturacionDiferente = !this.datosfacturacionDiferente;

      this.DatosFactura.Id_Agente = this.informacionCompra.DATOS_FACTURA.IDENTIFICACION_FACTURA;
      this.DatosFactura.Nombre = this.informacionCompra.DATOS_FACTURA.NOMBRE_FACTURA;
      this.DatosFactura.Tipo = this.informacionCompra.DATOS_FACTURA.TIPO_IDENTIFICACION_FACTURA;
      this.DatosFactura.Telefono = this.informacionCompra.DATOS_FACTURA.TELEFONO_FACTURA;
      this.DatosFactura.Calle_Principal_Agente = this.informacionCompra.DATOS_FACTURA.DIRECCION_FACTURA;
      this.DatosFactura.Correo = this.informacionCompra.DATOS_FACTURA.CORREO;

      if (this.DatosFactura.Tipo == 'Persona') {
        this.banderaTipo = true;
      } else if (this.DatosFactura.Tipo == 'Empresa') {
        this.banderaTipo = false;
      }
    }

    if (proceso == 'Siguiente') {
      console.log('COMPRA' + JSON.stringify(this.informacionCompra))
      this.siguienteDetallePedido = !this.siguienteDetallePedido;
    }
  }

  public guardarDireccionNueva() {
    if (document.forms['formActualizarDireccionEnvio'].checkValidity()) {

      this.informacionCompra.DATOS_ENTREGA.CALLE_PRINCIPAL_ENTREGA = this.DatosDireccion.Calle_Principal_Agente;
      this.informacionCompra.DATOS_ENTREGA.CALLE_SECUNDARIA_ENTREGA = this.DatosDireccion.Calle_Secundaria_Agente;
      this.informacionCompra.DATOS_ENTREGA.NUM_CASA_ENTREGA = this.DatosDireccion.Num_Casa_Agente;
      this.informacionCompra.DATOS_ENTREGA.COD_DPA_ENTREGA = this.DatosDireccion.Ciudad;

      this.provinciasDireccion.forEach(provincia => {
        if (provincia.COD_DPA.trim() == this.provinciaDireccion.trim())
          this.provinciaDireccionNombre = provincia.NOMBRE;
      })
      console.log(JSON.stringify(this.provinciasDireccion));
      this.ciudadesDireccion.forEach(ciudad => {
        if (ciudad.COD_DPA.trim() == this.DatosDireccion.Ciudad.trim()) {
          this.ciudadDireccionNombre = ciudad.NOMBRE;
          console.log('JDBSJCNSAKFJS');
        }
      })
      console.log(JSON.stringify(this.ciudadesDireccion) + this.ciudadDireccion + this.DatosDireccion.Ciudad);
      this.informacionCompra.DATOS_ENTREGA.NOMBRE_PERSONA_ENVIO_ENTREGA = this.DatosDireccion.Nombre;
      this.informacionCompra.DATOS_ENTREGA.NUM_COD_POSTAL_ENTREGA = this.DatosDireccion.Num_Cod_Postal;
      this.informacionCompra.DATOS_ENTREGA.TELEFONO_ENTREGA = this.DatosDireccion.Telefono;
      this.direccionEnvioDiferente = !this.direccionEnvioDiferente;
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

  validarCedula() {
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
        this.DatosFactura.Id_Agente = "";
        return false;
      }
    }
  }

  mostrarToast(mensaje, icono) {
    this.toastr.error('<div class="row no-gutters"><p class="col-12 LetrasToastInfo"><strong>!Error</strong><br>' + mensaje + '</p> </div>', "",
      {positionClass: 'toast-top-right', enableHtml: true, closeButton: true});
  }

  public cerrar() {
    this.direccionEnvioDiferente = false;
    this.datosfacturacionDiferente = false;
    this.siguienteDetallePedido = false;

    this.DatosDireccion = "";
    this.DatosFactura = "";
    this.informacionCompra = {
      COD_AGENTE: null,
      ID_AGENTE: null,
      ID_PRODUCTO: null,
      COD_PRODUCTO: null,
      FECHA_COMPRA: null,
      DATOS_ENTREGA: {
        CALLE_PRINCIPAL_ENTREGA: null,
        CALLE_SECUNDARIA_ENTREGA: null,
        NUM_CASA_ENTREGA: null,
        COD_DPA_ENTREGA: null,
        NOMBRE_PERSONA_ENVIO_ENTREGA: null,
        NUM_COD_POSTAL_ENTREGA: null,
        TELEFONO_ENTREGA: null,
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
        RECARGO_PAYPAL: null,
        PORCENTAJE_RECARGO_PAYPAL: null,
        TOTAL_PEDIDO: null,
      }
    };
    console.log(this.DatosDireccion + this.DatosFactura + JSON.stringify(this.informacionCompra))
  }

  public atras() {
    this.siguienteDetallePedido = false;
  }

  public carritoCompras = {
    NUM_VARIANTE: String,
    CANTIDAD: Number
  }

  public agregarCarrito() {
    this.carritoCompras.NUM_VARIANTE = this.varianteActiva.NUM_VARIANTE;
    this.carritoCompras.CANTIDAD = this.varianteActiva.CANTIDAD;
    console.log('CARRITO COMPRAS' + JSON.stringify(this.carritoCompras));
  }
}
