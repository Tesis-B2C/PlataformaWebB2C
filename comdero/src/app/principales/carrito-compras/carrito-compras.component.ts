import {Component, OnInit} from '@angular/core';
import {AgenteServicio} from "../../servicios/agente.servicio";
import {CarritoServicio} from "../../servicios/carrito.servicio";
import {GLOBAL} from 'src/app/servicios/global';
import {ToastrService} from "ngx-toastr";
import {MenuComponent} from "../menu/menu.component";
import {DatePipe} from "@angular/common";

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

  constructor(public datePipe: DatePipe, public menu: MenuComponent, public toastr: ToastrService, public  _agenteServicio: AgenteServicio, public _carritoServicio: CarritoServicio) {
  }

  async ngOnInit() {

    await this.iniciarCarritoCompras();
    await this.verificarStockInicio();
    await this.calcularPrecios();
    await this.verificarDescuentoAutomatico();


  }

  public reiniciar() {
    this.carritoIdentidad;
    // this.vTiendas = new Set();
    this.hoy;

    this.obj = {
      idTienda: null,
      producto_carrito: null,
      cuentas: {
        subTotal: null,
        iva: null,
        totalConIva: null,
        descuentoCupon: null,
        descuentoAutomatico: null
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
          cuentas: {
            subTotal: null,
            iva: null,
            totalConIva: null,
            descuentoCupon: null,
            descuentoAutomatico: null
          },
          cupones: new Set()

        }
        this.carritoIdentidad.data.CARRITO_PRODUCTOs.forEach(element => {
          console.log("tienda", element2);
          if (element.VARIANTE.PRODUCTO.OFERTum.TIENDA.NUM_TIENDA == element2) {
            this.obj.idTienda = element2;
            element.precio_productos_sin_iva = element.VARIANTE.PRECIO_UNITARIO * element.CANTIDAD_PRODUCTO_CARRITO;
            element.precio_productos = (element.VARIANTE.PRECIO_UNITARIO * element.CANTIDAD_PRODUCTO_CARRITO) + (element.VARIANTE.PRECIO_UNITARIO * element.CANTIDAD_PRODUCTO_CARRITO) * (element.VARIANTE.PRODUCTO.OFERTum.IVA / 100);
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
      if(tienda.producto_carrito.length==0){
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
      let bandera2:boolean=false;
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
                        bandera2=true;
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
                          bandera2=true;
                        }
                      }
                    } else {
                      if (descuento.DESCUENTO.MOTIVO_DESCUENTO == this.cupon) {

                        let precio = element.VARIANTE.PRECIO_UNITARIO + (element.VARIANTE.PRECIO_UNITARIO * (element.VARIANTE.PRODUCTO.OFERTum.IVA / 100))
                        d = d + ((precio * (descuento.DESCUENTO.PORCENTAJE_DESCUENTO / 100) * element.CANTIDAD_PRODUCTO_CARRITO));
                        console.log("descuento", d);
                        bandera2=true;
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
    let d = 0;
    for (let element2 of this.vTiendas) {
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

}
