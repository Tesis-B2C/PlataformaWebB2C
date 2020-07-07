import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductoServicio} from "../../../servicios/producto.servicio";
import Swal from "sweetalert2";
import {Oferta} from "../../../modelos/oferta";
import {Producto} from "../../../modelos/producto";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CategoriaServicio} from "../../../servicios/categoria.servicio";

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
  public categoriasSeleccionadas=new Set();
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


  //categorias
  public categoriaEncontrada = new Set();
  public categoriaEncontrada2 = new Set();

  public categorias: any;

  public c1 = [];
  public c2 = [];
  public c3 = [];

  public vectorIconos = ['fa fa-charging-station', 'fa fa-tshirt',
    'fa fa-ring', 'fa fa-baby-carriage', 'fa fa-home',
    'fa fa-gem', 'fa fa-palette', 'fa fa-laptop',
    'fa fa-car', 'fa fa-dumbbell', 'fa fa-book',
    'fa fa-dog', 'fa fa-gamepad', 'fa fa-grin-stars', 'fa fa-heartbeat', 'fa fa-building', 'fa fa-tractor'];

  constructor(private _categoriaServicio: CategoriaServicio,private modalService: NgbModal,private route: ActivatedRoute, private _productoServicio: ProductoServicio) {
    this.Oferta = new Oferta(null, null, "Garantia del vendedor");
    this.Producto = new Producto(null, null, null, null, null, null, null, null, null);

  }

  async ngOnInit() {
    this.getCategorias();
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
      this.categoriasSeleccionadas.add(c.CATEGORIum);
    })

  }

  abrirModalCategorias(content){
    this.modalService.open(content, { scrollable: true});
  }


  public async getCategorias() {
    try {
      let response = await this._categoriaServicio.getCategorias().toPromise();

      this.categorias = response.data;

      this.categorias.forEach(elemnt => {
        if (elemnt.TIPO == 'C1') {
          this.c1.push(elemnt)
        } else if (elemnt.TIPO == 'C2') {
          this.c2.push(elemnt)
        } else if (elemnt.TIPO == 'C3') {
          this.c3.push(elemnt)
        }
      })


    } catch (e) {
      console.log("error:" + JSON.stringify((e).error.message));
    }

  }
  public busquedaCategoria3(busqueda, event, c22, i) {

    let elemento = document.getElementById('labelcheckCategoria2' + i) as HTMLElement;
    let banderaSeleccionarCategoria = false;
    this.c3.forEach(c33 => {
      if (c33.CAT_ID_CATEGORIA == busqueda) {
        this.categoriaEncontrada.add(c33);
        banderaSeleccionarCategoria = true;
      }
    });

    if (event.target.checked) {
      elemento.classList.add('chip-alternativo');
    } else {
      elemento.classList.remove('chip-alternativo');
      elemento.classList.add('chip', 'col', 'btn', 'btn-light');
    }
    if (banderaSeleccionarCategoria == false && event.target.checked) {
      c22.i = i;
      this.categoriasSeleccionadas.add(c22);
    } else {
      this.categoriasSeleccionadas.delete(c22);
    }
  }


  busquedaCategoria2(busqueda) {
    this.c2.forEach(c22 => {
      if (c22.CAT_ID_CATEGORIA == busqueda) {
        this.categoriaEncontrada2.add(c22);
      }
    });
  }

  public seleccionarCategoria3(event, c33, i) {
    let elemento = document.getElementById('labelcheckCategoria3' + i) as HTMLElement;
    if (event.target.checked) {
      elemento.classList.add('chip2-alternativo');
      c33.i = i;
      this.categoriasSeleccionadas.add(c33);
    } else {
      /* elemento.style.backgroundColor = 'white';*/
      elemento.classList.remove('chip2-alternativo')
      elemento.classList.add('chip2', 'col', 'btn', 'btn-light');
      this.categoriasSeleccionadas.delete(c33);
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
}
