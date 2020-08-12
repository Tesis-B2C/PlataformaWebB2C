import {Component, Input, OnInit} from '@angular/core';
import {ProductoServicio} from "../../servicios/producto.servicio";
import {ActivatedRoute} from "@angular/router";
import Swal from "sweetalert2";
import {NgbRatingConfig} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleProductoComponent implements OnInit {
  @Input() id_Producto: any;
  public productoDetalle: any;

  public productoOpciones = {
    COLOR: String,
    TALLA: String,
    MATERIAL: String,
    PRECIO_UNITARIO: Number,
    STOCK: Number,
    MEDIDA: String,
    IMAGENES: []
  };

  currentRate = 1;

  constructor(configRating: NgbRatingConfig, private route: ActivatedRoute, private _productoServicio: ProductoServicio) {
    configRating.max = 5;
    configRating.readonly = true;
  }

  ngOnInit() {
    this.id_Producto = this.route.snapshot.params.idProducto;
    this.obtenerProducto();
  }

  public async obtenerProducto() {
    try {
      this.id_Producto = this.route.snapshot.params.idProducto;
      let response = await this._productoServicio.obtenerProductoDetalle(this.id_Producto).toPromise();
      this.productoDetalle = response.data;
      console.log('PROUCTO OBTENIDO BD' + JSON.stringify(this.productoDetalle));
    } catch (e) {
      console.log("error:" + e);
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
    }
  }

  public noExite = 'assets/images/no-image.png';

  getImagen(pathImagen) {
    this.noExite = 'assets/images/no-image.png';
    if (pathImagen) {
      this.noExite = 'http://localhost:3977/' + pathImagen;
    }
    return this.noExite;
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
