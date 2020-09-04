import {Component, OnInit} from '@angular/core';
import {AgenteServicio} from "../../servicios/agente.servicio";
import {CarritoServicio} from "../../servicios/carrito.servicio";
import {GLOBAL} from 'src/app/servicios/global';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-carrito-compras',
  templateUrl: './carrito-compras.component.html',
  styleUrls: ['./carrito-compras.component.css']
})
export class CarritoComprasComponent implements OnInit {

  public carritoIdentidad;
  public vTiendas = new Set();

  constructor(public toastr: ToastrService, public  _agenteServicio: AgenteServicio, public _carritoServicio: CarritoServicio) {
  }

  async ngOnInit() {

    await this.iniciarCarritoCompras();
    await this.verificarStockInicio();
  }

  public obj = {
    idTienda: null,
    producto_carrito: null,

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

        }
        this.carritoIdentidad.data.CARRITO_PRODUCTOs.forEach(element => {
          console.log("tienda", element2);
          if (element.VARIANTE.PRODUCTO.OFERTum.TIENDA.NUM_TIENDA == element2) {
            this.obj.idTienda = element2;
            element.precio_productos = element.VARIANTE.PRECIO_UNITARIO * element.CANTIDAD_PRODUCTO_CARRITO;
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

      }
    });

  }

  public async verificarStockInicio() {
    this.carritoIdentidad.data.CARRITO_PRODUCTOs.forEach(async element => {
      element.CANTIDAD_PRODUCTO_CARRITO = await this.actualizarCantidad(element.NUM_VARIANTE, this.carritoIdentidad.data.ID_CARRITO, element.CANTIDAD_PRODUCTO_CARRITO);
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
    } catch (e) {
      console.log(e);
    }
  }

}
