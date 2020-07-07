import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductoServicio} from "../../../servicios/producto.servicio";
import Swal from "sweetalert2";
import {Oferta} from "../../../modelos/oferta";
import {Producto} from "../../../modelos/producto";

@Component({
  selector: 'app-modificar-producto',
  templateUrl: './modificar-producto.component.html',
  styleUrls: ['./modificar-producto.component.css']
})
export class ModificarProductoComponent implements OnInit {

  public idProducto;
  public identidadProducto;
  public Oferta;
  public Producto;
  public categoriasSeleccionadas=[];
  public banderaValidaciones:boolean=true;
  public editorConfig = {
    "editable": true,
    "spellcheck": true,
    "height": "80px",
    "minHeight": "80px",
    "width": "auto",
    "minWidth": "0",
    "translate": "yes",
    "enableToolbar": true,
    "showToolbar": true,
    "imageEndPoint": "",
    "toolbar": [
      ["bold", "italic", "underline", "strikeThrough"],
      ["fontName", "fontSize",],
      ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
      ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
      ["paragraph", "blockquote", "removeBlockquote", "horizontalLine"],
    ]
  }
  constructor(private route: ActivatedRoute, private _productoServicio: ProductoServicio) {
    this.Oferta = new Oferta(null, null, "Garantia del vendedor");
    this.Producto = new Producto(null, null, null, null, null, null, null, null, null);

  }

  async ngOnInit() {

    await this.getProductos();
    this.iniciarModificarProducto();

  }

  public async getProductos() {
    try {
      this.idProducto = this.route.snapshot.params.id;
      let response = await this._productoServicio.getProducto(this.idProducto).toPromise();
      this.identidadProducto = response.data
      console.log("producto", this.identidadProducto);
    } catch (e) {
      console.log("error:" + e);
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
    }
  }


  iniciarModificarProducto() {
    this.Oferta.Iva = this.identidadProducto.IVA;
    this.Oferta.Garantia = this.identidadProducto.GARANTIA;
    this.Producto.Cod_Producto=this.identidadProducto.PRODUCTO.COD_PRODUCTO;
    this.Producto.Nombre_Producto = this.identidadProducto.PRODUCTO.NOMBRE_PRODUCTO;
    this.Producto.Descripcion_Producto = this.identidadProducto.PRODUCTO.DESCRIPCION_PRODUCTO;
    this.Producto.Detalle_Producto = this.identidadProducto.PRODUCTO.DETALLE_PRODUCTO;
    this.Producto.Marca = this.identidadProducto.PRODUCTO.MARCA;
    this.Producto.Rastrear_Stock = this.identidadProducto.PRODUCTO.LLEVAR_STOCK;
    this.Producto.Vender_Sin_Stoc = this.identidadProducto.PRODUCTO.VENDER_SIN_STOCK;
    this.Producto.Condicion = this.identidadProducto.PRODUCTO.CONDICION;
    this.Producto.Peso_Producto = this.identidadProducto.PRODUCTO.PESO_PRODUCTO;

    this.identidadProducto.PRODUCTO.PRODUCTO_CATEGORIA.forEach(c=>{
      this.categoriasSeleccionadas.push(c.CATEGORIum);
    })

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
