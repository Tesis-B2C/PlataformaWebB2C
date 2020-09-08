import {Component, OnInit} from '@angular/core';
import {AgenteServicio} from "../../servicios/agente.servicio";
import {CarritoServicio} from "../../servicios/carrito.servicio";
import {GLOBAL} from 'src/app/servicios/global';
import {ToastrService} from "ngx-toastr";
import {MenuComponent} from "../menu/menu.component";
import {DatePipe} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Agente} from "../../modelos/agente";
import {DpaServicio} from "../../servicios/dpa.servicio";
import * as moment from 'moment';

@Component({
  selector: 'app-carrito-compras',
  templateUrl: './carrito-compras.component.html',
  styleUrls: ['./carrito-compras.component.css'],
  providers: [DatePipe]
})
export class CarritoComprasComponent implements OnInit {

  public carritoIdentidad;
  public vTiendas = new Set();
  public hoy;

  public obj: any = {
    idTienda: null,
    producto_carrito: null,
    metodos_envio: [],
    metodos_pago: [],
    cuentas: {
      subTotal: null,
      iva: null,
      totalConIva: null,
      descuentoCupon: null,
      descuentoAutomatico: null
    },
    cupones: new Set()

  }


  public subTotal: number = 0;
  public totalConIva: number = 0;

  public cupon;
  private emailPattern: any = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$";
  public soloLetrasPattern: any = "[ a-zA-ZÑñáéíóúÁÉÍÓÚ ][ a-zA-ZÑñáéíóúÁÉÍÓÚ ]*$[0-9]{0}";
  private LetrasNumerosPattern: any = "[ .aA-zZ 0-9 ][ .aA-zZ 0-9 ]*$";
  private soloNumerosPattern: any = "[0-9][0-9]*$[A-Z]{0}";

  constructor(public  _dpaServicio: DpaServicio, private modalService: NgbModal, public datePipe: DatePipe, public menu: MenuComponent, public toastr: ToastrService, public  _agenteServicio: AgenteServicio, public _carritoServicio: CarritoServicio) {
  }

  async ngOnInit() {

    await this.iniciarCarritoCompras();
    await this.verificarStockInicio();
    await this.calcularPrecios();
    await this.verificarDescuentoAutomatico();
    await this.getDpaProvincias("P");

  }

  public reiniciar() {
    this.carritoIdentidad;
    // this.vTiendas = new Set();
    this.hoy;

    this.obj = {
      idTienda: null,
      producto_carrito: null,
      metodos_envio: [],
      metodos_pago: [],
      sucursales:[],
      contacto_whatsapp:null,
      cuentas: {
        subTotal: null,
        iva: null,
        totalConIva: null,
        descuentoCupon: null,
        descuentoAutomatico: null,
      },
      cupones: new Set()

    }

    this.subTotal = 0;
    this.totalConIva = 0;
    this.cupon;

  }


  public async iniciarCarritoCompras() {

    try {
      this.vTiendas.clear();
      let tiendas = new Set();
      this.carritoIdentidad = await this._carritoServicio.getCarrito().toPromise();

      this.carritoIdentidad.data.CARRITO_PRODUCTOs.forEach(element => {

        this.obj.idTienda = element.VARIANTE.PRODUCTO.OFERTum.TIENDA.NUM_TIENDA;
        tiendas.add(element.VARIANTE.PRODUCTO.OFERTum.TIENDA.NUM_TIENDA)
      });
      console.log("tiendas", this.carritoIdentidad);
      tiendas.forEach(element2 => {
        this.obj = {
          idTienda: null,
          producto_carrito: [],
          metodos_envio: [],
          metodos_pago: [],
          sucursales:[],
          contacto_whatsapp:null,
          cuentas: {
            subTotal: null,
            iva: null,
            totalConIva: null,
            descuentoCupon: 0,
            descuentoAutomatico: 0,

          },
          cupones: new Set()

        }
        this.carritoIdentidad.data.CARRITO_PRODUCTOs.forEach(element => {
          console.log("tienda", element2);

          if (element.VARIANTE.PRODUCTO.OFERTum.TIENDA.NUM_TIENDA == element2) {
            this.obj.idTienda = element2;
            element.precio_productos_sin_iva = element.VARIANTE.PRECIO_UNITARIO * element.CANTIDAD_PRODUCTO_CARRITO;
            element.precio_productos = (element.VARIANTE.PRECIO_UNITARIO * element.CANTIDAD_PRODUCTO_CARRITO) + (element.VARIANTE.PRECIO_UNITARIO * element.CANTIDAD_PRODUCTO_CARRITO) * (element.VARIANTE.PRODUCTO.OFERTum.IVA / 100);
            this.obj.metodos_envio = element.VARIANTE.PRODUCTO.OFERTum.TIENDA.OPCION_ENVIOs;
            this.obj.metodos_pago = element.VARIANTE.PRODUCTO.OFERTum.TIENDA.METODO_PAGOs;
           this.obj.sucursales=element.VARIANTE.PRODUCTO.OFERTum.TIENDA.SUCURSALs;
           this.obj.contacto_whatsapp=element.VARIANTE.PRODUCTO.OFERTum.TIENDA.CONTACTO_WHATSAPP;

            this.obj.producto_carrito.push(element);

          }
        })
        this.vTiendas.add(this.obj);
      });

      console.log("por tienda", this.vTiendas);

    } catch (e) {
      this.toastr.error(JSON.stringify(e.error.message));
    }
  }


  public noExite;

  getImagen(pathImagen) {
    this.noExite = 'assets/images/no-image.png';
    if (pathImagen) {
      this.noExite = GLOBAL.urlImagen + pathImagen;
    }
    return this.noExite;
  }

  public async incrementar(cantidad, stock, num_variante, id_carrito, idTienda) {
    cantidad = cantidad + 1;
    let response = await this.actualizarCantidad(num_variante, id_carrito, cantidad);
    console.log("response incrementar", response)
    this.carritoIdentidad.data.CARRITO_PRODUCTOs.forEach(element => {
      if (num_variante == element.NUM_VARIANTE) {
        element.CANTIDAD_PRODUCTO_CARRITO = response;
        element.precio_productos_sin_iva = element.VARIANTE.PRECIO_UNITARIO * element.CANTIDAD_PRODUCTO_CARRITO;
        element.precio_productos = (element.VARIANTE.PRECIO_UNITARIO * element.CANTIDAD_PRODUCTO_CARRITO) + (element.VARIANTE.PRECIO_UNITARIO * element.CANTIDAD_PRODUCTO_CARRITO) * (element.VARIANTE.PRODUCTO.OFERTum.IVA / 100);
      }
    });

    await this.calcularPrecios();
    await this.verificarDescuentoAutomatico();
    await this.verificarNuevamenteCupon(idTienda);
  }

  public async verificarStockInicio() {
    this.carritoIdentidad.data.CARRITO_PRODUCTOs.forEach(async element => {
      element.CANTIDAD_PRODUCTO_CARRITO = await this.actualizarCantidad(element.NUM_VARIANTE, this.carritoIdentidad.data.ID_CARRITO, element.CANTIDAD_PRODUCTO_CARRITO);
      element.precio_productos_sin_iva = element.VARIANTE.PRECIO_UNITARIO * element.CANTIDAD_PRODUCTO_CARRITO;
      element.precio_productos = (element.VARIANTE.PRECIO_UNITARIO * element.CANTIDAD_PRODUCTO_CARRITO) + (element.VARIANTE.PRECIO_UNITARIO * element.CANTIDAD_PRODUCTO_CARRITO) * (element.VARIANTE.PRODUCTO.OFERTum.IVA / 100);
      if (element.CANTIDAD_PRODUCTO_CARRITO == 0) {

        element.CANTIDAD_PRODUCTO_CARRITO = await this.actualizarCantidad(element.NUM_VARIANTE, this.carritoIdentidad.data.ID_CARRITO, 1);
        element.precio_productos_sin_iva = element.VARIANTE.PRECIO_UNITARIO * element.CANTIDAD_PRODUCTO_CARRITO;
        element.precio_productos = (element.VARIANTE.PRECIO_UNITARIO * element.CANTIDAD_PRODUCTO_CARRITO) + (element.VARIANTE.PRECIO_UNITARIO * element.CANTIDAD_PRODUCTO_CARRITO) * (element.VARIANTE.PRODUCTO.OFERTum.IVA / 100);
      }
    });
  }


  public async decrementar(cantidad, stock, num_variante, id_carrito, idTienda) {

    if (cantidad <= 1)
      cantidad = 1;
    else
      cantidad = cantidad - 1;

    let response = await this.actualizarCantidad(num_variante, id_carrito, cantidad);
    console.log("response incrementar", response)
    this.carritoIdentidad.data.CARRITO_PRODUCTOs.forEach(element => {
      if (num_variante == element.NUM_VARIANTE) {
        element.CANTIDAD_PRODUCTO_CARRITO = response;
        element.precio_productos_sin_iva = element.VARIANTE.PRECIO_UNITARIO * element.CANTIDAD_PRODUCTO_CARRITO;
        element.precio_productos = (element.VARIANTE.PRECIO_UNITARIO * element.CANTIDAD_PRODUCTO_CARRITO) + (element.VARIANTE.PRECIO_UNITARIO * element.CANTIDAD_PRODUCTO_CARRITO) * (element.VARIANTE.PRODUCTO.OFERTum.IVA / 100);
      }
    });
    await this.calcularPrecios();
    await this.verificarDescuentoAutomatico();
    await this.verificarNuevamenteCupon(idTienda);
  }


  async actualizarCantidad(num_variante, id_carrito, cantidad) {
    try {
      let response = await this._carritoServicio.updateCantidadProducto(num_variante, id_carrito, cantidad).toPromise();
      return response.data
    } catch (e) {
      console.log(JSON.stringify(e.error.data));
      //this.toastr.error(JSON.stringify(e.error.message));
      return e.error.data
    }
  }

  async deleteProductoCarrito(num_variante, tienda, i) {
    try {
      let response = await this._carritoServicio.deleteProductoCarrito(num_variante).toPromise();
      this.reiniciar();
      tienda.producto_carrito.splice(i, 1);
      if (tienda.producto_carrito.length == 0) {
        this.vTiendas.delete(tienda)
      }
      await this.calcularPrecios();
      await this.verificarDescuentoAutomatico();
      this.verificarNuevamenteCupon(tienda.idTienda);
      await this.menu.conteoProductosCarrito(true);
      console.log("despues de borrar", this.vTiendas);

    } catch (e) {
      console.log(e);
    }
  }


  calcularPrecios() {
    for (let element of this.vTiendas) {
      this.subTotal = 0;
      this.totalConIva = 0;

      console.log("ver tienda para calcular", element['producto_carrito']);
      for (let element2 of element['producto_carrito']) {
        if (element2.VARIANTE.PRODUCTO.OFERTum.TIENDA.NUM_TIENDA == element['idTienda']) {
          this.subTotal = this.subTotal + element2.precio_productos_sin_iva;
          this.totalConIva = this.totalConIva + element2.precio_productos;
        }
      }

      element['cuentas'].subTotal = this.subTotal;
      element['cuentas'].totalConIva = this.totalConIva;
      element['cuentas'].iva = this.totalConIva - this.subTotal;
    }


  }


  verificarCupon(tienda) {
    this.hoy = new Date();
    debugger;
    for (let element2 of this.vTiendas) {
      let d = 0;
      let bandera: boolean = true;
      let bandera2: boolean = false;
      for (let element of element2['producto_carrito']) {
        if (element.VARIANTE.PRODUCTO.OFERTum.TIENDA.NUM_TIENDA == tienda) {
          for (let descuento of element.VARIANTE.PRODUCTO.PRODUCTO_DESCUENTOs) {
            if (descuento.DESCUENTO.TIPO_DESCUENTO == 'Cupón') {

              if (descuento.DESCUENTO.ESTADO_DESCUENTO == 0) {

                if (this.datePipe.transform(this.hoy, "yyyy-MM-dd") >= descuento.DESCUENTO.FECHA_INICIO && this.datePipe.transform(this.hoy, "yyyy-MM-dd") <= descuento.DESCUENTO.FECHA_FIN) {


                  if (this.datePipe.transform(this.hoy, "yyyy-MM-dd") == descuento.DESCUENTO.FECHA_INICIO) {

                    let horaActual = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
                    if (this.obtenerMinutos(horaActual) >= this.obtenerMinutos(descuento.DESCUENTO.HORA_INICIO)) {
                      if (descuento.DESCUENTO.MOTIVO_DESCUENTO == this.cupon) {

                        let precio = element.VARIANTE.PRECIO_UNITARIO + (element.VARIANTE.PRECIO_UNITARIO * (element.VARIANTE.PRODUCTO.OFERTum.IVA / 100))
                        d = d + ((precio * (descuento.DESCUENTO.PORCENTAJE_DESCUENTO / 100) * element.CANTIDAD_PRODUCTO_CARRITO));
                        console.log("descuento", d);
                        bandera2 = true;
                      }
                    }

                  } else {
                    if (this.datePipe.transform(this.hoy, "yyyy-MM-dd") == descuento.DESCUENTO.FECHA_FIN) {
                      let horaActual = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
                      if (this.obtenerMinutos(horaActual) <= this.obtenerMinutos(descuento.DESCUENTO.HORA_FIN)) {
                        if (descuento.DESCUENTO.MOTIVO_DESCUENTO == this.cupon) {

                          let precio = element.VARIANTE.PRECIO_UNITARIO + (element.VARIANTE.PRECIO_UNITARIO * (element.VARIANTE.PRODUCTO.OFERTum.IVA / 100))
                          d = d + ((precio * (descuento.DESCUENTO.PORCENTAJE_DESCUENTO / 100) * element.CANTIDAD_PRODUCTO_CARRITO));
                          console.log("descuento", d);
                          bandera2 = true;
                        }
                      }
                    } else {
                      if (descuento.DESCUENTO.MOTIVO_DESCUENTO == this.cupon) {

                        let precio = element.VARIANTE.PRECIO_UNITARIO + (element.VARIANTE.PRECIO_UNITARIO * (element.VARIANTE.PRODUCTO.OFERTum.IVA / 100))
                        d = d + ((precio * (descuento.DESCUENTO.PORCENTAJE_DESCUENTO / 100) * element.CANTIDAD_PRODUCTO_CARRITO));
                        console.log("descuento", d);
                        bandera2 = true;
                      }
                    }
                  }


                }
              }


            }
          }
        }
      }

      for (let element3 of element2['cupones']) {
        if (element3 == this.cupon) {
          bandera = false;
        }
      }
      if (bandera && bandera2) {
        element2['cupones'].add(this.cupon);
        element2['cuentas'].descuentoCupon = element2['cuentas'].descuentoCupon + d;
      }
    }
    this.cupon = "";
  }

  verificarNuevamenteCupon(tienda) {

    let d = 0;
    for (let element2 of this.vTiendas) {
      for (let element of element2['producto_carrito']) {
        if (element.VARIANTE.PRODUCTO.OFERTum.TIENDA.NUM_TIENDA == element2['idTienda']) {
          for (let descuento of element.VARIANTE.PRODUCTO.PRODUCTO_DESCUENTOs) {
            for (let elemnt2 of this.vTiendas) {
              if (elemnt2['idTienda'] == tienda) {
                for (let element3 of elemnt2['cupones']) {
                  if (element3 == descuento.DESCUENTO.MOTIVO_DESCUENTO) {
                    let precio = element.VARIANTE.PRECIO_UNITARIO + (element.VARIANTE.PRECIO_UNITARIO * (element.VARIANTE.PRODUCTO.OFERTum.IVA / 100))
                    d = d + ((precio * (descuento.DESCUENTO.PORCENTAJE_DESCUENTO / 100) * element.CANTIDAD_PRODUCTO_CARRITO));
                    console.log("descuento", d);
                    elemnt2['cuentas'].descuentoCupon = 0;
                    elemnt2['cuentas'].descuentoCupon = elemnt2['cuentas'].descuentoCupon + d;
                  }
                }
              }
            }
          }

        }
      }
    }


  }


  verificarDescuentoAutomatico() {
    this.hoy = new Date();

    for (let element2 of this.vTiendas) {
      let d = 0;
      for (let element of element2['producto_carrito']) {
        if (element.VARIANTE.PRODUCTO.OFERTum.TIENDA.NUM_TIENDA == element2['idTienda']) {
          for (let descuento of element.VARIANTE.PRODUCTO.PRODUCTO_DESCUENTOs) {
            if (descuento.DESCUENTO.TIPO_DESCUENTO == 'Automático') {

              if (descuento.DESCUENTO.ESTADO_DESCUENTO == 0) {

                if (this.datePipe.transform(this.hoy, "yyyy-MM-dd") >= descuento.DESCUENTO.FECHA_INICIO && this.datePipe.transform(this.hoy, "yyyy-MM-dd") <= descuento.DESCUENTO.FECHA_FIN) {


                  if (this.datePipe.transform(this.hoy, "yyyy-MM-dd") == descuento.DESCUENTO.FECHA_INICIO) {

                    let horaActual = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
                    if (this.obtenerMinutos(horaActual) >= this.obtenerMinutos(descuento.DESCUENTO.HORA_INICIO)) {
                      let precio = element.VARIANTE.PRECIO_UNITARIO + (element.VARIANTE.PRECIO_UNITARIO * (element.VARIANTE.PRODUCTO.OFERTum.IVA / 100))
                      d = d + (precio * (descuento.DESCUENTO.PORCENTAJE_DESCUENTO / 100)) * element.CANTIDAD_PRODUCTO_CARRITO;
                      console.log("descuento automatico", d);
                    }
                  } else {
                    if (this.datePipe.transform(this.hoy, "yyyy-MM-dd") == descuento.DESCUENTO.FECHA_FIN) {
                      let horaActual = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
                      if (this.obtenerMinutos(horaActual) <= this.obtenerMinutos(descuento.DESCUENTO.HORA_FIN)) {
                        let precio = element.VARIANTE.PRECIO_UNITARIO + (element.VARIANTE.PRECIO_UNITARIO * (element.VARIANTE.PRODUCTO.OFERTum.IVA / 100))
                        d = d + (precio * (descuento.DESCUENTO.PORCENTAJE_DESCUENTO / 100)) * element.CANTIDAD_PRODUCTO_CARRITO;
                        console.log("descuento automatico", d);
                      }
                    } else {
                      let precio = element.VARIANTE.PRECIO_UNITARIO + (element.VARIANTE.PRECIO_UNITARIO * (element.VARIANTE.PRODUCTO.OFERTum.IVA / 100))
                      d = d + (precio * (descuento.DESCUENTO.PORCENTAJE_DESCUENTO / 100)) * element.CANTIDAD_PRODUCTO_CARRITO;
                      console.log("descuento automatico", d);
                    }
                  }
                }
              }
            }
          }
        }
      }

      element2['cuentas'].descuentoAutomatico = 0;

      element2['cuentas'].descuentoAutomatico = element2['cuentas'].descuentoAutomatico + d;

    }

  }

  obtenerMinutos(hora) {
    if (hora) {
      var spl = hora.split(":");
      return parseInt(spl[0]) * 60 + parseInt(spl[1]);
    }
  }

  asignarVariableActiva(tienda) {
    this.varianteActiva.PRECIO_UNITARIO_CON_IVA = tienda.cuentas.totalConIva;
    this.varianteActiva.PRECIO_UNITARIO = tienda.cuentas.subTotal;
    this.varianteActiva.PRECIO_UNITARIO_CON_IVA_DESCUENTO = tienda.cuentas.totalConIva - tienda.cuentas.descuentoAutomatico - tienda.cuentas.descuentoCupon;
    this.varianteActiva.variantes = tienda.producto_carrito;
    this.varianteActiva.OPCION_ENVIO = tienda.metodos_envio;
    this.varianteActiva.METODO_PAGO = tienda.metodos_pago;
    this.varianteActiva.PORCENTAJE_IMPUESTO = tienda.cuentas.iva;
    this.varianteActiva.DESCUENTO_AUTOMATICO = tienda.cuentas.descuentoAutomatico;
    this.varianteActiva.DESCUENTO_CUPON = tienda.cuentas.descuentoCupon;
    this.varianteActiva.SUCURSALES=tienda.sucursales;
    this.varianteActiva.CONTACTO_WHATSAPP=tienda.contacto_whatsapp;

    console.log("variante activa", this.varianteActiva);
  }


// vanesssa

  public varianteActiva = {
    PRECIO_UNITARIO_CON_IVA: null,
    PRECIO_UNITARIO_CON_IVA_DESCUENTO: null,
    PRECIO_UNITARIO: null,
    variantes: [],
    OPCION_ENVIO: [],
    METODO_PAGO: [],
    SUCURSALES:[],
    CONTACTO_WHATSAPP:null,
    PORCENTAJE_IMPUESTO: null,
    DESCUENTO_AUTOMATICO: 0,
    DESCUENTO_CUPON: 0
  };
  public informacionCompra = {
    COD_AGENTE: null,
    ID_AGENTE: null,
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
      PORCENTAJE_AUTOMATICO: null,
      CUPON: null,
      PORCENTAJE_CUPON: null,
      RECARGO_PAYPAL: null,
      PORCENTAJE_RECARGO_PAYPAL: null,
      COSTOS_ENVIO: null,
      TOTAL_PEDIDO: null
    }
  };
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
  public identidadComprador;
  public DatosDireccion;
  public DatosFactura;
  public ciudadDireccionNombre;
  public provinciaDireccionNombre;

  public abrirModalFinalizarPedido(content, tienda) {
    this.asignarVariableActiva(tienda);
    this.verificarMetodosTienda();
    this.identidadComprador = this._agenteServicio.getIdentity();
    console.log('AGENTE' + JSON.stringify(this.identidadComprador));

    //DATOS DE COMPRA QUE PUEDEN NO ESTAR
    if (this.identidadComprador.ID_AGENTE != null) {
      console.log('SI HAY DIRECCION');
      this.DatosDireccion = new Agente(null, this.identidadComprador.NUM_COD_POSTAL, this.identidadComprador.NOMBRE,
        this.identidadComprador.TELEFONO, null, null, 0, this.identidadComprador.CALLE_PRINCIPAL_AGENTE,
        this.identidadComprador.CALLE_SECUNDARIA_AGENTE, this.identidadComprador.NUM_CASA_AGENTE, null, this.identidadComprador.COD_DPA,
        null);

      this.DatosFactura = new Agente(this.identidadComprador.ID_AGENTE, null, this.identidadComprador.NOMBRE,
        this.identidadComprador.TELEFONO, this.identidadComprador.CORREO, this.identidadComprador.TIPO, 0,
        this.identidadComprador.CALLE_PRINCIPAL_AGENTE + ' ' + this.identidadComprador.CALLE_SECUNDARIA_AGENTE + ',' + this.identidadComprador.DPA.NOMBRE + ',' + this.identidadComprador.DPA.DPAP.NOMBRE,
        null, null, null, null, null);

      this.informacionCompra.ID_AGENTE = this.identidadComprador.ID_AGENTE;

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
    this.informacionCompra.FECHA_COMPRA = moment().format("YYYY-MM-DD");

    this.informacionCompra.METODO_PAGO_COMPRA = null;
    this.informacionCompra.METODO_ENVIO_COMPRA = null;

    this.informacionCompra.COSTOS.PRECIO_UNITARIO_PRODUCTO = this.varianteActiva.PRECIO_UNITARIO;
    this.informacionCompra.COSTOS.TOTAL_PRODUCTOS = this.varianteActiva.PRECIO_UNITARIO; //Buscar descuento y menorar
    this.informacionCompra.COSTOS.IMPUESTOS = (this.varianteActiva.PRECIO_UNITARIO_CON_IVA-this.varianteActiva.PRECIO_UNITARIO);
    this.informacionCompra.COSTOS.SUBTOTAL = this.informacionCompra.COSTOS.TOTAL_PRODUCTOS + this.informacionCompra.COSTOS.IMPUESTOS;

    this.informacionCompra.COSTOS.DESCUENTOS = this.varianteActiva.DESCUENTO_AUTOMATICO;
    this.informacionCompra.COSTOS.CUPON = this.varianteActiva.DESCUENTO_CUPON;
    //cupones
    this.varianteActiva.METODO_PAGO.forEach(pago => {
      if (pago.TIPO_PAGO == 'Electrónico') {
        this.informacionCompra.COSTOS.PORCENTAJE_RECARGO_PAYPAL = pago.PORCENTAJE_RECARGO;
      }
    });

    this.informacionCompra.COSTOS.COSTOS_ENVIO = 0;
    this.informacionCompra.COSTOS.TOTAL_PEDIDO = (this.informacionCompra.COSTOS.SUBTOTAL + this.informacionCompra.COSTOS.RECARGO_PAYPAL + this.informacionCompra.COSTOS.COSTOS_ENVIO) - (this.informacionCompra.COSTOS.DESCUENTOS + this.informacionCompra.COSTOS.CUPON);
    console.log('VARIANTE COMPRAS' + JSON.stringify(this.informacionCompra));
    //FIN DATOS DE COMPRA
    this.modalService.open(content, {centered: true, size: 'lg', backdrop: "static"});
  }

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

  public banderaDireccionEnvio: boolean = false;
  public direccionEnvioDiferente: boolean = false;
  public datosfacturacionDiferente: boolean = false;
  public siguienteDetallePedido: boolean = false;
  public noExisteEnvioEstaArea: boolean = false;
  public banderaRecargoPaypal: boolean = false;

  public selectMetodoEnvio(event) {
    this.banderaDireccionEnvio = false;
    this.noExisteEnvioEstaArea = false;
    this.informacionCompra.METODO_ENVIO_COMPRA = event.target.value;
    this.informacionCompra.METODO_PAGO_COMPRA = null;
    this.banderaRecargoPaypal = false;
    this.informacionCompra.COSTOS.COSTOS_ENVIO = 0;
    if (event.target.value == 'Domicilio') {
      this.banderaDireccionEnvio = true;
      this.calcularCostosEnvioDomicilio();
    }
    this.informacionCompra.COSTOS.TOTAL_PEDIDO = (this.informacionCompra.COSTOS.SUBTOTAL + this.informacionCompra.COSTOS.RECARGO_PAYPAL + this.informacionCompra.COSTOS.COSTOS_ENVIO) - (this.informacionCompra.COSTOS.DESCUENTOS + this.informacionCompra.COSTOS.CUPON);
  }

  public arrayPreciosEnvioAux = [];
  public pesoPedidoTotalKg = 0;

  public calcularCostosEnvioDomicilio() {
    let localExisteUno = 'No Existe Local';
    let restoExisteUno = 'No Existe Resto';
    this.arrayPreciosEnvioAux = [];
    this.pesoPedidoTotalKg=0;

    this.varianteActiva.variantes.forEach(element=>{
      this.pesoPedidoTotalKg =this.pesoPedidoTotalKg +  element.VARIANTE.PRODUCTO.PESO_PRODUCTO * element.CANTIDAD_PRODUCTO_CARRITO;
    })

    if (this.informacionCompra.DATOS_ENTREGA.CALLE_PRINCIPAL_ENTREGA != null) {
      let banderaEncontroDireccion: boolean = false;
      for (let opSucursales of this.varianteActiva.SUCURSALES) {
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
              if (this.informacionCompra.COSTOS.SUBTOTAL >= envioDomicilio.MINIMO && this.informacionCompra.COSTOS.SUBTOTAL <= envioDomicilio.MAXIMO) {
                this.arrayPreciosEnvioAux.push(envioDomicilio.PRECIO);
              }
            }
            if (envioDomicilio.TIPO_MEDIDA == 'Peso') {
              //DE ACUERDO AL PESO DEL PEDIDO
              console.log('//DE ACUERDO AL PESO DEL PEDIDO',this.pesoPedidoTotalKg);
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
              if (this.informacionCompra.COSTOS.SUBTOTAL >= envioDomicilio.MINIMO && this.informacionCompra.COSTOS.SUBTOTAL <= envioDomicilio.MAXIMO) {
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

  public banderaTipo: boolean;

  public habilitarDireccionDiferente(proceso) {
    if (proceso == 'Envio') {
      this.activarSelectDireccion = false;
      this.direccionEnvioDiferente = !this.direccionEnvioDiferente;
      this.ciudadDireccion = null;
      this.provinciaDireccion = null;
      this.DatosDireccion.Num_Cod_Postal = this.informacionCompra.DATOS_ENTREGA.NUM_COD_POSTAL_ENTREGA;
      this.DatosDireccion.Nombre = this.informacionCompra.DATOS_ENTREGA.NOMBRE_PERSONA_ENVIO_ENTREGA;
      this.DatosDireccion.Telefono = this.informacionCompra.DATOS_ENTREGA.TELEFONO_ENTREGA;
      this.DatosDireccion.Calle_Principal_Agente = this.informacionCompra.DATOS_ENTREGA.CALLE_PRINCIPAL_ENTREGA;
      this.DatosDireccion.Calle_Secundaria_Agente = this.informacionCompra.DATOS_ENTREGA.CALLE_SECUNDARIA_ENTREGA;
      this.DatosDireccion.Num_Casa_Agente = this.informacionCompra.DATOS_ENTREGA.NUM_CASA_ENTREGA;
      this.DatosDireccion.Ciudad = this.informacionCompra.DATOS_ENTREGA.COD_DPA_ENTREGA;
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
  }


  public selectMetodoPago(event) {
    this.banderaRecargoPaypal = false;
    this.informacionCompra.COSTOS.RECARGO_PAYPAL = 0;
    this.informacionCompra.METODO_PAGO_COMPRA = event.target.value;
    if (event.target.value == 'Electrónico') {
      this.banderaRecargoPaypal = true;
      this.informacionCompra.COSTOS.RECARGO_PAYPAL = (this.informacionCompra.COSTOS.SUBTOTAL * this.informacionCompra.COSTOS.PORCENTAJE_RECARGO_PAYPAL) / 100;
    }
    this.informacionCompra.COSTOS.TOTAL_PEDIDO = (this.informacionCompra.COSTOS.SUBTOTAL + this.informacionCompra.COSTOS.RECARGO_PAYPAL + this.informacionCompra.COSTOS.COSTOS_ENVIO) - (this.informacionCompra.COSTOS.DESCUENTOS + this.informacionCompra.COSTOS.CUPON);
  }

  public provinciasDireccion;
  public ciudadDireccion;

  async getDpaProvincias(buscar) {
    try {
      let response = await this._dpaServicio.getDpaProvincias(buscar).toPromise();
      this.provinciasDireccion = response.data;
    } catch (e) {
      console.log("error:" + JSON.stringify((e).error.message));
    }
  }

  public activarSelectDireccion: boolean = false;
  public ciudadesDireccion;

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

  public select_ciudad: boolean = false;

  async seleccionarCiudad(event) {
    this.select_ciudad = false;
    this.DatosDireccion.Ciudad = event;
  }

  public provinciaDireccion;

  public guardarDireccionNueva() {
    if (document.forms['formActualizarDireccionEnvio'].checkValidity()) {
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
      this.mostrarToast("Al parecer existe errores en su formulario por favor revise nuevamente, debe llenar todos los campos obligatorios (*)", "");
    }
  }

  public cambiarTipo(value) {
    this.DatosFactura.Tipo = value;
    if (value == 'Persona') {
      this.banderaTipo = true;
    } else if (value == 'Empresa') {
      this.banderaTipo = false;
    }
  }

  public mostrarToast(mensaje, icono) {
    this.toastr.error('<div class="row no-gutters"><p class="col-12 LetrasToastInfo"><strong>!Error</strong><br>' + mensaje + '</p> </div>', "",
      {positionClass: 'toast-top-right', enableHtml: true, closeButton: true});
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

    this.banderaRecargoPaypal = false;
    this.noExisteEnvioEstaArea = false;
    this.direccionEnvioDiferente = false;
    this.datosfacturacionDiferente = false;
    this.siguienteDetallePedido = false;
    this.banderaDireccionEnvio = false;

  this.informacionCompra = {
      COD_AGENTE: null,
      ID_AGENTE: null,
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

  public atras() {
    this.siguienteDetallePedido = !this.siguienteDetallePedido;
  }
}

