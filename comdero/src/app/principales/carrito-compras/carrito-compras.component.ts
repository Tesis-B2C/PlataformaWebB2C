import {Component, OnInit} from '@angular/core';
import {AgenteServicio} from "../../servicios/agente.servicio";
import {CarritoServicio} from "../../servicios/carrito.servicio";
import {GLOBAL} from 'src/app/servicios/global';
import {ToastrService} from "ngx-toastr";
import {MenuComponent} from "../menu/menu.component";

@Component({
  selector: 'app-carrito-compras',
  templateUrl: './carrito-compras.component.html',
  styleUrls: ['./carrito-compras.component.css']
})
export class CarritoComprasComponent implements OnInit {

  public carritoIdentidad;
  public vTiendas = new Set();

  constructor(public menu: MenuComponent, public toastr: ToastrService, public  _agenteServicio: AgenteServicio, public _carritoServicio: CarritoServicio) {
  }

  async ngOnInit() {

    await this.iniciarCarritoCompras();
    await this.verificarStockInicio();
    await this.calcular();


  }

  public obj: any = {
    idTienda: null,
    producto_carrito: null,
    cuentas: {
      subTotal: null,
      iva: null,
      totalConIva: null,
      descuentoCupon: null
    },
    cupones: new Set()

  }


  public async iniciarCarritoCompras() {

    try {
      this.vTiendas = new Set();
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
            descuentoCupon: null
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

  public async incrementar(cantidad, stock, num_variante, id_carrito) {
    debugger;
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


  public async decrementar(cantidad, stock, num_variante, id_carrito) {

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

  async deleteProductoCarrito(num_variante) {
    try {
      let response = await this._carritoServicio.deleteProductoCarrito(num_variante).toPromise();
      this.iniciarCarritoCompras();
      this.menu.conteoProductosCarrito();
    } catch (e) {
      console.log(e);
    }
  }

  public subTotal: number = 0;
  public totalConIva: number = 0;

  calcularPrecios(tienda) {
    this.subTotal = 0;
    this.totalConIva = 0;
    for (let element of this.carritoIdentidad.data.CARRITO_PRODUCTOs) {
      if (element.VARIANTE.PRODUCTO.OFERTum.TIENDA.NUM_TIENDA == tienda) {
        this.subTotal = this.subTotal + element.precio_productos_sin_iva;
        this.totalConIva = this.totalConIva + element.precio_productos;
      }
    }
    for (let elemnt2 of this.vTiendas) {
      console.log("tienda numero", elemnt2['idTienda']);
      if (elemnt2['idTienda'] == tienda) {
        elemnt2['cuentas'].subTotal = this.subTotal;
        elemnt2['cuentas'].totalConIva = this.totalConIva;
        elemnt2['cuentas'].iva = this.totalConIva - this.subTotal;
      }
      console.log("element2", elemnt2);
    }

  }

  public calcular() {
    for (let elemente2 of this.vTiendas) {
      console.log("tienda antes de mandar", elemente2['idTienda']);
      this.calcularPrecios(elemente2['idTienda']);
    }

  }

  public cupon;

  verificarCupon(tienda) {
    debugger;
    let d = 0;
    for (let element of this.carritoIdentidad.data.CARRITO_PRODUCTOs) {
      if (element.VARIANTE.PRODUCTO.OFERTum.TIENDA.NUM_TIENDA == tienda) {
        for (let descuento of element.VARIANTE.PRODUCTO.PRODUCTO_DESCUENTOs) {
          if (descuento.DESCUENTO.TIPO_DESCUENTO == 'Cupón') {
            if (descuento.DESCUENTO.MOTIVO_DESCUENTO == this.cupon) {

              let precio = element.VARIANTE.PRECIO_UNITARIO + (element.VARIANTE.PRECIO_UNITARIO * (element.VARIANTE.PRODUCTO.OFERTum.IVA / 100))
              d = d + (precio * (descuento.DESCUENTO.PORCENTAJE_DESCUENTO / 100));
              console.log("descuento", d);
            }
          }
        }
      }
    }

    debugger;
    let bandera: boolean = true;
    for (let elemnt2 of this.vTiendas) {
      if (elemnt2['idTienda'] == tienda) {
        for (let element3 of elemnt2['cupones']) {
          if (element3 == this.cupon) {
            bandera = false;
          }
        }
        if (bandera) {
          elemnt2['cupones'].add(this.cupon);
          elemnt2['cuentas'].descuentoCupon = elemnt2['cuentas'].descuentoCupon + d;
        }
      }
    }
  }


}
