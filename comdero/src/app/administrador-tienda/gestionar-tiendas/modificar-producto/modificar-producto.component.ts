import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProductoServicio} from "../../../servicios/producto.servicio";
import Swal from "sweetalert2";
import {Oferta} from "../../../modelos/oferta";
import {Producto} from "../../../modelos/producto";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CategoriaServicio} from "../../../servicios/categoria.servicio";
import {Variante} from "../../../modelos/variante";
import {Imagen_Producto} from "../../../modelos/imagen_producto";
import {UnidadMedidaServicio} from "../../../servicios/unidad_medida.servicio";
import {DomSanitizer} from "@angular/platform-browser";
import {CurrencyPipe} from "@angular/common";
import {Cmyk, ColorPickerService} from "ngx-color-picker";
import {ToastrService} from "ngx-toastr";
import { GLOBAL } from 'src/app/servicios/global';

@Component({
  selector: 'app-modificar-producto',
  templateUrl: './modificar-producto.component.html',
  styleUrls: ['./modificar-producto.component.css'],
  providers: [CurrencyPipe]
})
export class ModificarProductoComponent implements OnInit, OnDestroy {

  public idProducto;
  public identidadProducto;
  public Oferta;
  public Producto;
  public Variantes;
  public categoriasSeleccionadas = new Set();
  public banderaValidaciones: boolean = false;
  public editorConfig = {
    "editable": false,
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

// multimedia
  public Imagenes_Producto = [[]];
  public imagenes = [[]];
  public vectorBanderaAgregarImagen = [];
  public vectorBanderaHabilitante = [];
  public vbanderaMensajeMaximoImagenes=[];
  public banderaMensajeMaximoVideo: boolean = false;
  public data: any = [];
  public banderaAnimacionVideo: boolean = false;
  public videoYoutube;

  //UNIDADES DE MEDIDA
  public unidades: any;
  public identidadTienda;

  // video

  public videoPorGuardar;
  public videoYoutubeGuardar: any;
  public direccionVideoYoutube: any;

  public auxi = null;
  public auxj = null;

  public banderaModificar: boolean = false;
  public loading: boolean = false;

  constructor(  private router: Router,public toastr: ToastrService, private cpService: ColorPickerService, private cp: CurrencyPipe, private _sanitizer: DomSanitizer, private _unidadesMedidaServicio: UnidadMedidaServicio, private _categoriaServicio: CategoriaServicio, private modalService: NgbModal, private route: ActivatedRoute, private _productoServicio: ProductoServicio) {
    this.Oferta = new Oferta(null, null, null, null);
    this.Producto = new Producto(null, null, null, null, null, null, null, null, null);
    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));
    this.videoPorGuardar = new Imagen_Producto(null, null, null, null)
  }

  async ngOnInit() {

    //await this.getProducto();
    this.iniciarModificarProducto();
    this.getCategorias();
    this.getUnidadesMedida()

  }

  ngOnDestroy(): void {
    delete this.Producto;
    delete this.Oferta;
    delete this.Variantes;
    this.toastr.clear();
    delete this.Imagenes_Producto;
    delete this.videoYoutubeGuardar;
    delete this.videoPorGuardar;
  }

  public async getProducto() {
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

  cancelar() {
    this.loading = false;
    this.banderaModificar = false;
    this.banderaValidaciones = false;
    this.categoriaEncontrada = new Set();
    this.categoriaEncontrada2 = new Set();
    this.Imagenes_Producto = [];
    this.imagenes = [];
    this.Variantes = [];
    this.data = [];
    this.videoYoutube = "";
    this.categoriasSeleccionadas = new Set();


    this.vectorBanderaAgregarImagen = [];
    this.vectorBanderaHabilitante = [];
    this.vbanderaMensajeMaximoImagenes= [];
    this.banderaMensajeMaximoVideo = false;
    this.banderaAnimacionVideo = false;
    this.auxi = null;
    this.auxj = null;
  }

  public async iniciarModificarProducto() {
    this.cancelar();
    await this.getProducto();
    this.Oferta.Id_Oferta = this.identidadProducto.ID_OFERTA;
    this.Oferta.Num_Tienda = this.identidadTienda.NUM_TIENDA;
    this.Oferta.Iva = this.identidadProducto.IVA;
    this.Oferta.Garantia = this.identidadProducto.GARANTIA;
    this.Oferta.Estado_Oferta = this.identidadProducto.ESTADO_OFERTA;
    this.Producto.Id_Producto = this.identidadProducto.PRODUCTO.ID_PRODUCTO;
    this.Producto.Cod_Producto = this.identidadProducto.PRODUCTO.COD_PRODUCTO;
    this.Producto.Nombre_Producto = this.identidadProducto.PRODUCTO.NOMBRE_PRODUCTO;
    this.Producto.Descripcion_Producto = this.identidadProducto.PRODUCTO.DESCRIPCION_PRODUCTO;
    this.Producto.Detalle_Producto = this.identidadProducto.PRODUCTO.DETALLE_PRODUCTO;
    this.Producto.Marca = this.identidadProducto.PRODUCTO.MARCA;
    this.Producto.Rastrear_Stock = this.identidadProducto.PRODUCTO.LLEVAR_STOCK;
    this.Producto.Vender_Sin_Stock = this.identidadProducto.PRODUCTO.VENDER_SIN_STOCK;
    this.Producto.Condicion = this.identidadProducto.PRODUCTO.CONDICION;
    this.Producto.Peso_Producto = this.identidadProducto.PRODUCTO.PESO_PRODUCTO;

    let c = this.identidadProducto.PRODUCTO.PRODUCTO_CATEGORIA;
    for (let i in c) {
      c[i].CATEGORIum.i = i;
      this.categoriasSeleccionadas.add(c[i].CATEGORIum);
    }
    let v = this.identidadProducto.PRODUCTO.VARIANTEs;
    for (let i in v) {
      this.Imagenes_Producto.push([]);
      this.imagenes.push([]);
      this.vectorBanderaAgregarImagen.push(true);
      this.vectorBanderaHabilitante.push(true);
      debugger
      this.Variantes.push(new Variante(v[i].COLOR, v[i].TALLA, v[i].MATERIAL, v[i].PRECIO_UNITARIO, v[i].STOCK, v[i].MEDIDA, v[i].ESTADO_VARIANTE));
      this.Variantes[i].Num_Variante = v[i].NUM_VARIANTE;
      for (let j in v[i].IMAGEN_PRODUCTOs) {

        if (v[i].IMAGEN_PRODUCTOs[j].TIPO_IMAGEN != "video" && v[i].IMAGEN_PRODUCTOs[j].TIPO_IMAGEN != "youtube") {
          this.Imagenes_Producto[i].push(new Imagen_Producto(v[i].IMAGEN_PRODUCTOs[j].NOMBRE_IMAGEN, v[i].IMAGEN_PRODUCTOs[j].TIPO_IMAGEN, v[i].IMAGEN_PRODUCTOs[j].IMAGEN, v[i].IMAGEN_PRODUCTOs[j].TAMANIO_IMAGEN));
          this.Imagenes_Producto[i][j].Id_Imagen = v[i].IMAGEN_PRODUCTOs[j].ID_IMAGEN;
          this.Imagenes_Producto[i][j].Estado_Imagen = 0;
          this.imagenes[i][j] = GLOBAL.urlImagen+ v[i].IMAGEN_PRODUCTOs[j].IMAGEN
        } else if (v[i].IMAGEN_PRODUCTOs[j].TIPO_IMAGEN == "video") {
          this.imagenes[i][j] = "video"
          this.auxi = i;
          this.auxj = j;
          this.data.video = GLOBAL.urlImagen + v[i].IMAGEN_PRODUCTOs[j].IMAGEN;
          this.videoPorGuardar = new Imagen_Producto(v[i].IMAGEN_PRODUCTOs[j].NOMBRE_IMAGEN, v[i].IMAGEN_PRODUCTOs[j].TIPO_IMAGEN, v[i].IMAGEN_PRODUCTOs[j].IMAGEN, v[i].IMAGEN_PRODUCTOs[j].TAMANIO_IMAGEN);
          this.videoPorGuardar.Id_Imagen = v[i].IMAGEN_PRODUCTOs[j].ID_IMAGEN;
          this.videoPorGuardar.Estado_Imagen = 0;
          this.videoPorGuardar.path = v[i].IMAGEN_PRODUCTOs[j].IMAGEN;
          this.Imagenes_Producto[i].push(this.videoPorGuardar);
        } else if (v[i].IMAGEN_PRODUCTOs[j].TIPO_IMAGEN == "youtube") {
          this.imagenes[i][j] = "video"
          this.auxi = i;
          this.auxj = j;
          this.direccionVideoYoutube = v[i].IMAGEN_PRODUCTOs[j].IMAGEN;
          this.getVideoIframeInicio();
          this.videoPorGuardar = new Imagen_Producto('Video', 'youtube', this.direccionVideoYoutube, 0);
          this.videoPorGuardar.Id_Imagen = v[i].IMAGEN_PRODUCTOs[j].ID_IMAGEN;
          this.videoPorGuardar.Estado_Imagen = 0;
          this.Imagenes_Producto[i].push(this.videoPorGuardar);
        }
      }
      console.log("variantes", this.imagenes)

    }

  }

  public abrirModalCategorias(content) {
    this.modalService.open(content, {scrollable: true});
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


  public banderaAux: boolean;

  public busquedaCategoria3(busqueda, event, c22, i) {
    this.banderaAux = false;
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
      for (let obj of this.categoriasSeleccionadas) {
        if (obj['ID_CATEGORIA'] == c22.ID_CATEGORIA) {
          this.banderaAux = true
        }
      }
      debugger;
      if (this.banderaAux == false) {
        this.categoriasSeleccionadas.add(c22);
      }

    } else {
      this.categoriasSeleccionadas.delete(c22);
    }
  }

  public busquedaCategoria2(busqueda) {
    this.c2.forEach(c22 => {
      if (c22.CAT_ID_CATEGORIA == busqueda) {
        this.categoriaEncontrada2.add(c22);
      }
    });
  }

  public banderaAux2: boolean;

  public seleccionarCategoria3(event, c33, i) {
    this.banderaAux2 = false;
    let elemento = document.getElementById('labelcheckCategoria3' + i) as HTMLElement;
    if (event.target.checked) {
      elemento.classList.add('chip2-alternativo');
      c33.i = i;


      for (let obj of this.categoriasSeleccionadas) {
        if (obj['ID_CATEGORIA'] == c33.ID_CATEGORIA) {
          this.banderaAux2 = true
        }
      }
      if (!this.banderaAux2) {
        this.categoriasSeleccionadas.add(c33);
      }

    } else {
      /* elemento.style.backgroundColor = 'white';*/
      elemento.classList.remove('chip2-alternativo')
      elemento.classList.add('chip2', 'col', 'btn', 'btn-light');
      this.categoriasSeleccionadas.delete(c33);
    }
  }

  public async subirImagenes(eventEntrante, indice) {
    if (this.imagenes[indice] == null) {
      this.imagenes[indice] = [];
    }
    this.vectorBanderaHabilitante[indice] = true;
   /* this.vbanderaMensajeMaximoImagenes[indice]=true;*/
    if (eventEntrante.target.files && eventEntrante.target.files[0]) {
      var filesAmount = eventEntrante.target.files.length;
      this.vectorBanderaAgregarImagen[indice] = true;
      if (filesAmount > 6) {
        this.vbanderaMensajeMaximoImagenes[indice]= true;
        this.vectorBanderaHabilitante[indice] = true;
      } else {
        for (let i = 0; i < filesAmount; i++) {
          this.Imagenes_Producto[indice].push(new Imagen_Producto(eventEntrante.target.files[i].name, eventEntrante.target.files[i].type, eventEntrante.target.files[i], eventEntrante.target.files[i].size));
          this.Imagenes_Producto[indice][this.Imagenes_Producto[indice].length - 1].Estado_Imagen = 1;
          debugger;
          var reader = new FileReader();
          reader.onload = (event: any) => {
            if (this.imagenes[indice] != null)
              this.imagenes[indice].push(event.target.result);
            document.forms["form"].reset();

          }
          await reader.readAsDataURL(eventEntrante.target.files[i]);
        }
        debugger;
        if (this.Imagenes_Producto[0].filter(imagen => (imagen.Tipo_Imagen == 'video' || imagen.Tipo_Imagen == 'youtube')).length > 0) {
          if (this.Imagenes_Producto[indice].length > 6 && indice != 0) {
            this.vbanderaMensajeMaximoImagenes[indice] = true;
            this.vectorBanderaHabilitante[indice] = false;

          } else if (this.Imagenes_Producto[indice].length > 7) {
            this.vbanderaMensajeMaximoImagenes[indice] = true
            this.vectorBanderaHabilitante[indice] = false;

          }
        } else {
          if (this.Imagenes_Producto[indice].length > 6) {
            this.vbanderaMensajeMaximoImagenes[indice] = true;
            this.vectorBanderaHabilitante[indice] = false;

          }
        }
      }
    }
  }

  public subirVideo(event) {
    let fileList: FileList = event.target.files;
    this.data = {};
    if (fileList.length > 0) {
      this.banderaAnimacionVideo = true;
      let file: File = fileList[0];
      this.videoPorGuardar.Nombre_Imagen = file.name;
      this.videoPorGuardar.Tipo_Imagen = 'video';
      this.videoPorGuardar.Imagen = event.target.files[0];
      this.videoPorGuardar.Tamanio_Imagen = file.size;
      this.videoPorGuardar.Estado_Imagen = 1;
      if (this.auxi != null) {
        this.Imagenes_Producto[this.auxi][this.auxj] = this.videoPorGuardar;
      }
      // this.videoPorGuardar = new Imagen_Producto(file.name, file.type, event.target.files[0], file.size);
      //  this.videoPorGuardar.Estado_Imagen=1;
      /*  console.log('video seleccionado', file);*/
      if (file.size < 150000000) {
        this.banderaMensajeMaximoVideo = false
        let myReader: FileReader = new FileReader();
        let that = this;
        myReader.onloadend = (loadEvent: any) => {
          //  console.log('video', myReader.result);
          this.data.video = myReader.result;
          this.data.type = file.type;
          this.banderaAnimacionVideo = false;
        };
        myReader.readAsDataURL(file);
      } else {
        this.banderaAnimacionVideo = false;
        this.banderaMensajeMaximoVideo = true;
      }
    }
  }

  public async getUnidadesMedida() {
    try {
      let response = await this._unidadesMedidaServicio.getUnidadesMedida().toPromise();
      this.unidades = response.data;

    } catch (e) {
      console.log("error:" + JSON.stringify((e).error.message));
    }
  }

  public abrirModalVideoYoutube(content) {
    this.modalService.open(content, {centered: true, size: 'md'});
  }


  public getVideoIframeInicio() {
    let url = this.direccionVideoYoutube;
    var video, results;

    if (url === null) {
      return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    video = (results === null) ? url : results[1];
    //delete this.videoPorGuardar;
    this.videoYoutube = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);
    // delete this.videoPorGuardar;
    this.data.video = "";
  }


  public getVideoIframe() {
    let url = this.direccionVideoYoutube;
    var video, results;

    if (url === null) {
      return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    video = (results === null) ? url : results[1];
    //delete this.videoPorGuardar;
    this.videoYoutube = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);
    this.videoPorGuardar.Nombre_Imagen = 'Video';
    this.videoPorGuardar.Tipo_Imagen = 'youtube';
    this.videoPorGuardar.Imagen = this.direccionVideoYoutube;
    this.videoPorGuardar.Tamanio_Imagen = "0";
    this.videoPorGuardar.Estado_Imagen = 1;
    if (this.auxi != null) {
      this.Imagenes_Producto[this.auxi][this.auxj] = this.videoPorGuardar;
    }
    // delete this.videoPorGuardar;
    this.data.video = "";
  }

  public resetearVideoYoutube() {
    this.videoYoutube = null;
  }

  public formatear(element) {
    debugger;
    let valor = this.cp.transform(element.target.value, '$',);
    //let alter=formatCurrency(element.target.value,'USD',getCurrencySymbol('USD', 'wide'));
    if (valor) {
      let valor2 = valor.split("$")
      element.target.value = valor2[1].replace(',', "");
    }
  }

  public opcionGarantia(garantia) {
    console.log("Garantia", garantia)
    this.Oferta.Garantia = garantia;
  }

  public opcionRastrearStock(event) {
    if (event.target.checked) {
      this.Producto.Rastrear_Stock = 0;
    } else {
      this.Producto.Rastrear_Stock = 1;
    }
  }

  public opcionVenderSinStock(event) {
    if (event.target.checked) {
      this.Producto.Vender_Sin_Stock = 0;
    } else {
      this.Producto.Vender_Sin_Stock = 1;
    }
  }

  public cambiarColor(color: string, indice): Cmyk {
    const hsva = this.cpService.stringToHsva(color);
    const rgba = this.cpService.hsvaToRgba(hsva);
    console.log(color);
    console.log(rgba);
    this.Variantes[indice].Color = color;
    console.log("Variante despuez de color", this.Variantes[indice]);
    return this.cpService.rgbaToCmyk(rgba);
  }

  public agregarOpcionesProducto() {
    this.vectorBanderaAgregarImagen.push(false);
    this.vectorBanderaHabilitante.push(true);
    this.Variantes.push(new Variante(null, null, null, null, 1, "unidades", 1));
    this.Imagenes_Producto.push([]);
    this.imagenes.push([]);
    console.log("asdasd");
  }

  public quitarImagenes(indice: any, imagen) {

    if (this.Imagenes_Producto[indice][imagen].Estado_Imagen == 1) {
      this.imagenes[indice].splice(imagen, 1);
      document.forms["form"].reset();
      this.Imagenes_Producto[indice].splice(imagen, 1);
      console.log("vector imagenes", this.imagenes[indice]);
    } else if (this.Imagenes_Producto[indice][imagen].Estado_Imagen == 0) {
      this.Imagenes_Producto[indice][imagen].Estado_Imagen = 2;

    }


    if (this.Imagenes_Producto[0].filter(imagen => (imagen.Tipo_Imagen == 'video' || imagen.Tipo_Imagen == 'youtube')).length > 0) {
      if (this.Imagenes_Producto[indice].length > 6 && indice != 0) {
        this.vbanderaMensajeMaximoImagenes[indice] = true;
        this.vectorBanderaHabilitante[indice] = false;

      } else if (this.Imagenes_Producto[indice].length > 7) {
        this.vbanderaMensajeMaximoImagenes[indice] = true;
        this.vectorBanderaHabilitante[indice] = false;

      } else {
        this.vectorBanderaHabilitante[indice] = true;
        this.vbanderaMensajeMaximoImagenes[indice] = false
      }
    } else {
      if (this.Imagenes_Producto[indice].length > 6) {
        this.vbanderaMensajeMaximoImagenes[indice] = true;
        this.vectorBanderaHabilitante[indice] = false;

      } else {
        this.vectorBanderaHabilitante[indice] = true;
        this.vbanderaMensajeMaximoImagenes[indice] = false
      }
    }

    if (this.imagenes[indice].length == 0) {
      this.vectorBanderaAgregarImagen[indice] = false;
    }
    debugger
    if (this.Imagenes_Producto[indice].filter(imagen => (imagen.Tipo_Imagen == 'video' || imagen.Tipo_Imagen == 'youtube')).length > 0) {
      if (this.Imagenes_Producto[indice].filter(imagen => (imagen.Estado_Imagen == 2)).length == this.Imagenes_Producto[indice].length && indice != 0) {
        this.vectorBanderaAgregarImagen[indice] = false;
        this.vectorBanderaHabilitante[indice] = false;
      } else if (this.Imagenes_Producto[indice].filter(imagen => (imagen.Estado_Imagen == 2)).length == this.Imagenes_Producto[indice].length - 1) {
        this.vectorBanderaAgregarImagen[indice] = false;
        this.vectorBanderaHabilitante[indice] = false;
      }

    } else {
      if (this.Imagenes_Producto[indice].filter(imagen => (imagen.Estado_Imagen == 2)).length == this.Imagenes_Producto[indice].length) {
        this.vectorBanderaAgregarImagen[indice] = false;
        this.vectorBanderaHabilitante[indice] = false;
      }
    }


  }

  public borrarVideo() {
    debugger;
    if (this.Imagenes_Producto[0].filter(imagen => (imagen.Tipo_Imagen == 'video' || imagen.Tipo_Imagen == 'youtube')).length > 0) {
      //this.videoPorGuardar = "";
      this.videoYoutube = "";
      this.data.video = "";
      for (let j in this.Imagenes_Producto[0]) {
        if (this.Imagenes_Producto[0][j].Tipo_Imagen == 'video' || this.Imagenes_Producto[0][j].Tipo_Imagen == 'youtube') {
          this.Imagenes_Producto[0][j].Estado_Imagen = 2;
          if (this.Imagenes_Producto[0][j].path) {
            this.Imagenes_Producto[0][j].Imagen = this.Imagenes_Producto[0][j].path;
          }
        }
      }

    } else {
      this.videoPorGuardar = "";
      this.data.video = "";
      this.videoYoutube = "";
    }
  }

  public borrarOpcionesProducto(pocicion: number) {
    debugger;
    if (this.Variantes.filter(v => v.Estado_Variante == 2).length < this.Variantes.length - 1) {
      if (this.Variantes[pocicion].Estado_Variante == 1) {
        this.Variantes.splice(pocicion, 1);
        this.vectorBanderaAgregarImagen[pocicion] = false;
        this.Imagenes_Producto[pocicion] = [];
        this.imagenes[pocicion] = [];
      } else if (this.Variantes[pocicion].Estado_Variante == 0) {
        this.vectorBanderaAgregarImagen[pocicion] = false;
        this.Variantes[pocicion].Estado_Variante = 2;

      }
    }
  }


  public validar(): boolean {
    this.banderaValidaciones = true;
    debugger;
    if (this.vectorBanderaHabilitante.filter(v => v == false).length == 0 && this.categoriasSeleccionadas.size > 0 && document.forms["formInformacion"].checkValidity()) {
      if (document.forms["formVariaciones0"] != null) {
        if (this.validarFormularios()) {
          return true;
        } else {
          let body = document.getElementById('body') as HTMLElement;
          body.scrollTo(0, 0);
          window.scroll(0, 0);
          this.toastr.error('<div class="row no-gutters"><p class="col-12 LetrasToastInfo">Existe errores en el formulario porfavor revisalo nuevamente</p></div>', "Error!",
            {positionClass: 'toast-top-right', enableHtml: true, closeButton: true, disableTimeOut: false});
          return false
        }
      } else {
        return true;
      }
    } else {
      let body = document.getElementById('body') as HTMLElement;
      body.scrollTo(0, 0);
      window.scroll(0, 0);
      this.toastr.error('<div class="row no-gutters"><p class="col-12 LetrasToastInfo">Existe errores en el formulario porfavor revisalo nuevamente</p></div>', "Error!",
        {positionClass: 'toast-top-right', enableHtml: true, closeButton: true, disableTimeOut: false});
      return false
    }
  }
  validarFormularios() {
    let bandera=true;
    for(let i in this.Variantes){
      if(document.forms["formVariaciones"+i].checkValidity()){
        bandera=true;
      }else {
        bandera=false;
      }
    }

    return bandera;
  }

  categoriasEnviar = [];


  public async guardarProducto() {

    Swal.fire({
      title: '<header class="login100-form-title-registro mb-o"><h5 class="card-title"><strong>!Estas seguro</strong></h5></header>',
      text: "El producto será registrado y publicado en su tienda asegurate de que los datos sean correctos",
      icon: 'warning',
      position: 'center',
      width: 600,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-primary px-5',
        container: 'my-swal',
        cancelButton: 'btn btn-secondary px-5 ml-5',
      }
    }).then(async (result) => {
      if (result.value) {
        try {
          console.log("oferta", this.Oferta, "producto", this.Producto, "Variantes", this.Variantes, "Imagen producto", this.Imagenes_Producto, "video producto", this.videoPorGuardar, "categoria", this.categoriasSeleccionadas)
          let response = await this._productoServicio.updateProducto(this.identidadProducto.ID_OFERTA, this.Oferta, this.Producto, this.Variantes, this.Imagenes_Producto, this.categoriasEnviar).toPromise();
          this.mensageCorrecto(response['message']);
          this.iniciarModificarProducto();
          this.loading = false;
        }catch (e) {
          this.loading = false;
          console.log("error:" + e);
          if (JSON.stringify((e).error.message))
            this.mensageError(JSON.stringify((e).error.message));
          else this.mensageError("Error de conexión intentelo mas tarde");
        }
      }
    })


  }

  public async guardarCambiarEstadoProducto(estado) {

    Swal.fire({
      title: '<header class="login100-form-title-registro mb-o"><h5 class="card-title"><strong>!Estas seguro</strong></h5></header>',
      text: "Estas seguro que deseas cambiar de estado a este producto",
      icon: 'warning',
      position: 'center',
      width: 600,
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-primary px-5',
        container: 'my-swal',
        cancelButton: 'btn btn-secondary px-5 ml-5',
      }
    }).then(async (result) => {
      if (result.value) {
        this.loading = true;
        this.cambiarEstadoProducto(estado);

      }
    })


  }

  public async cambiarEstadoProducto(estado) {

    try {
      let responseUpdate = await this._productoServicio.updateEstadoProducto(this.identidadProducto.ID_OFERTA, estado).toPromise();
      this.mensageCorrecto(responseUpdate['menssage']);
      let response = await this._productoServicio.getMisProductos(this.identidadTienda.NUM_TIENDA).toPromise();
      //this.router.navigate(['/administrador/administrador-tienda/gestion-tienda/menu-gestion-tienda/listado-productos']);
      this.iniciarModificarProducto();
    } catch (e) {

      console.log("error:" + e);
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
    }

  }

  public async publicarProducto() {
    try {
      debugger;
      this.loading=true;
      if (this.validar()) {
        if (this.auxi == null && this.videoPorGuardar.Tamanio_Imagen != null) {
          this.Imagenes_Producto[0].push(this.videoPorGuardar);
        }
        this.categoriasEnviar = [];
        for (let categorias of this.categoriasSeleccionadas) {
          this.categoriasEnviar.push(categorias['ID_CATEGORIA']);
        }
        this.guardarProducto();

      }
      this.loading = false
    } catch
      (e) {
      this.loading = false;
      console.log("error:" + e);
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
    }

  }

  public eliminarCategoria(cc) {
    debugger;
    if (cc.TIPO == "C3") {
      //  let elemento3 = document.getElementById('labelcheckCategoria3' + cc.i) as HTMLElement;
      //  elemento3.classList.remove('chip2-alternativo')
      //elemento3.classList.add('chip2', 'col', 'btn', 'btn-light');
    } else if (cc.TIPO == "C2") {
      // let elemento2 = document.getElementById('labelcheckCategoria2' + cc.i) as HTMLElement;
      // elemento2.classList.remove('chip-alternativo')
      //elemento2.classList.add('chip', 'col', 'btn', 'btn-light');
    }
    this.categoriasSeleccionadas.delete(cc);

  }

  public iniciarEdicion() {
    this.banderaModificar = true;
    this.editorConfig.editable = true;
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


  mensageCorrecto(mensaje) {
    Swal.fire({
      icon: 'success',
      title: '<header class="login100-form-title-registro"><h5 class="card-title">!Correcto..</h5></header>',
      text: mensaje,
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
