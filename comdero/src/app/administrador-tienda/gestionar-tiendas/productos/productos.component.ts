import {ChangeDetectionStrategy, Component, DoCheck, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {CategoriaServicio} from "../../../servicios/categoria.servicio";
import {UnidadMedidaServicio} from "../../../servicios/unidad_medida.servicio";
import {Cmyk, ColorPickerService} from "ngx-color-picker";
import {Oferta} from "../../../modelos/oferta";
import {Producto} from "../../../modelos/producto";
import {Variante} from "../../../modelos/variante";
import {Imagen_Producto} from "../../../modelos/imagen_producto";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DomSanitizer} from '@angular/platform-browser';
import {ProductoServicio} from '../../../servicios/producto.servicio';
import Swal from 'sweetalert2'
import {ToastrService} from 'ngx-toastr';
import {CurrencyPipe, Location} from '@angular/common'
import {ActivatedRoute, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers: [CurrencyPipe],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProductosComponent implements OnInit, DoCheck, OnChanges, OnDestroy {


  public vBanderaAgregarImagenesVariante=[];
  public videoPorGuardar;
  public Imagenes_Producto = [[]];
  public imagenes = [[]];
  public unidades: any;
  public vectorBanderaAgregarImagen = [false];
  public banderaMaximoImagenes: boolean = true;
  public vbanderaMensajeMaximoImagenes=[];
  public banderaMensajeMaximoVideo: boolean = false;
  public data: any = [];
  public banderaAnimacionVideo: boolean = false;

  // banderas de envios a domicilio

  public banderaVariaciones: boolean = false;
  public Variantes = [];
  //
  public categorias: any;
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
  public vectorOpciones: Array<number> = []; // las dos formas swon validas pero la activa es ams facil
  /*public vectorOpciones=new Array(0);
    public vectorOpciones=[];
  * */

  public visible = true;
  public color = [''];
  public categoriasSeleccionadas = new Set();
  public vectorIconos = ['fa fa-charging-station', 'fa fa-tshirt',
    'fa fa-ring', 'fa fa-baby-carriage', 'fa fa-home',
    'fa fa-gem', 'fa fa-palette', 'fa fa-laptop',
    'fa fa-car', 'fa fa-dumbbell', 'fa fa-book',
    'fa fa-dog', 'fa fa-gamepad', 'fa fa-grin-stars', 'fa fa-heartbeat', 'fa fa-building', 'fa fa-tractor'];


  // vector categorias
  public c1 = [];
  public c2 = [];
  public c3 = [];

  //
  public categoriaEncontrada = new Set();
  public categoriaEncontrada2 = new Set();
  public panelUno;
  public panelDos;
  // objetos
  public Oferta: Oferta;
  public Producto: Producto

  // videos
  public videoYoutube: any;
  public videoYoutubeGuardar: any;
  public direccionVideoYoutube: any;
// enviar

  public identidadTienda;

  public banderaValidaciones: boolean = false;

  public categoriasEnviar = [];

  public loading: boolean = false;
 public permisorecargar:boolean=true;

  constructor(public router: Router, private route: ActivatedRoute, private location: Location, private cp: CurrencyPipe, public toastr: ToastrService, private _productoServicio: ProductoServicio, private _sanitizer: DomSanitizer, private modalService: NgbModal, private _categoriaServicio: CategoriaServicio, private _unidadesMedidaServicio: UnidadMedidaServicio, private cpService: ColorPickerService) {
    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));
    this.Oferta = new Oferta(this.identidadTienda.NUM_TIENDA, null, "Garantia del vendedor", 0);
    this.Producto = new Producto("000000", null, null, null, null, 1, 1, "Nuevo", null);
    this.Variantes.push(new Variante(null, null, null, null, null, "unidades", 0));
  }
  public recargar(){
    this.permisorecargar=false;
  }
  ngOnInit() {

    this.getCategorias();
    this.getUnidadesMedida();
    this.panelUno = document.getElementById('panelUno') as HTMLElement;
    this.panelDos = document.getElementById('panelDos') as HTMLElement;
    if (this.identidadTienda.OPCION_ENVIOs.length == 0) {
      this.mostrarToast("Asegúrate de tener configurado tus métodos de envio antes de empezar a publicar tus productos", "fa fa-truck fa-2x");
    }
    if (this.identidadTienda.METODO_PAGOs.length == 0) {
      this.mostrarToast("Asegúrate de tener configurado tus métodos de pago antes de empezar a publicar tus productos", "fas fa-credit-card fa-2x");
    }
  }

  public cancelar() {
this.borrarVideo();
    this.vBanderaAgregarImagenesVariante=[];
    this.permisorecargar=false;
    document.forms["formInformacion"].reset();
    document.forms["formInventario"].reset();
    document.forms["formPrecios"].reset();
    document.forms["formGarantia"].reset();
    document.forms["formCheckVariaciones"].reset();

    if (document.forms["formVariaciones"] != null) {
      document.forms["formVariaciones"].reset();
    }

    this.Imagenes_Producto = [[]];
    this.imagenes = [[]];

    this.vectorBanderaAgregarImagen = [false];
    this.banderaMaximoImagenes = true;
    this.vbanderaMensajeMaximoImagenes = [];
    this.banderaMensajeMaximoVideo = false;
    this.data = [];

    this.banderaAnimacionVideo = false;
    // banderas de envios a domicilio
    this.banderaVariaciones = false;
    this.Variantes = [];
    //
    this.vectorOpciones = []; // las dos formas swon validas pero la activa es ams facil
    this.visible = true;
    this.color = [''];
    this.categoriasSeleccionadas = new Set();
    this.c1 = [];
    this.c2 = [];
    this.c3 = [];
    this.categoriaEncontrada = new Set();
    this.categoriaEncontrada2 = new Set();
    this.banderaValidaciones = false;

    this.categoriasEnviar = [];
    this.loading = false;

    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));
    this.Oferta = new Oferta(this.identidadTienda.NUM_TIENDA, null, "Garantia del vendedor", 0);
    this.Producto = new Producto("000000", null, null, null, null, 1, 1, "Nuevo", null);
    this.Variantes.push(new Variante(null, null, null, null, null, "unidades", 0));

    let codigo = document.getElementById('codigoProducto') as HTMLInputElement;
    debugger;
    codigo.value = this.Producto.Cod_Producto.toString();
    this.getCategorias();
    this.getUnidadesMedida();
    debugger;
  }

  public mostrarToast(mensaje, icono) {
    this.toastr.info('<div class="row no-gutters"><p class="col-10 white mb-0"><strong style="font-size: xx-large">!Importante</strong><br>' + mensaje + '</p> <a class="d-flex align-items-center col-2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="' + icono + '"></span></a></div>', "",
      {positionClass: 'toast-bottom-right', enableHtml: true, closeButton: true, disableTimeOut: true});
  }


  ngDoCheck(): void {
    this.panelDos.style.maxHeight = this.panelUno.offsetHeight + 'px';

  }

  ngOnChanges(): void {
    this.panelDos.style.maxHeight = this.panelUno.offsetHeight + 'px';
    // console.log("height |", this.panelUno.offsetHeight + 'px');

  }

  ngOnDestroy() {
    delete this.Producto;
    delete this.Oferta;
    delete this.Variantes;
    this.toastr.clear();
    delete this.Imagenes_Producto;
    delete this.videoYoutubeGuardar;
    delete this.videoPorGuardar;


  }


  public async subirImagenes(eventEntrante, indice) {
    if (this.imagenes[indice] == null) {
      this.imagenes[indice] = [];
    }
    if (eventEntrante.target.files && eventEntrante.target.files[0]) {
      var filesAmount = eventEntrante.target.files.length;

      if (filesAmount > 6) {
        this.vbanderaMensajeMaximoImagenes[indice] = true;
      } else {
        this.vectorBanderaAgregarImagen[indice] = true;
        for (let i = 0; i < filesAmount; i++) {
          this.Imagenes_Producto[indice].push(new Imagen_Producto(eventEntrante.target.files[i].name, eventEntrante.target.files[i].type, eventEntrante.target.files[i], eventEntrante.target.files[i].size));
          var reader = new FileReader();
          reader.onload = (event: any) => {
            if (this.imagenes[indice] != null)
              this.imagenes[indice].push(event.target.result);
            document.forms["form"].reset();
            //  document.forms["formVariaciones"].reset();

          }
          await reader.readAsDataURL(eventEntrante.target.files[i]);
        }
        if (this.Imagenes_Producto[indice].length > 6) {
          this.imagenes[indice] = null;
          this.Imagenes_Producto[indice].splice(0, this.Imagenes_Producto[indice].length);
          document.forms["form"].reset();
          // document.forms["formVariaciones"].reset();

          this.vectorBanderaAgregarImagen[indice] = false;
          this.vbanderaMensajeMaximoImagenes[indice] = true;
        } else if (this.Imagenes_Producto[indice].length == 6) {
          this.vbanderaMensajeMaximoImagenes[indice] = false
          this.banderaMaximoImagenes = false;
        } else if (this.Imagenes_Producto[indice].length == 0) {
          this.vbanderaMensajeMaximoImagenes[indice] = false
          this.banderaMaximoImagenes = false;
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
      this.videoPorGuardar = new Imagen_Producto(file.name, 'video', event.target.files[0], file.size);

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

  public quitarImagenes(indice: any, imagen) {
    this.imagenes[indice].splice(imagen, 1);
    document.forms["form"].reset();
    //  document.forms["formVariaciones"].reset();
    debugger;
    this.Imagenes_Producto[indice].splice(imagen, 1);
    // console.log("vector imagenes", this.imagenes[indice]);
    if (this.imagenes[indice].length == 0)
      this.vectorBanderaAgregarImagen[indice] = false;
  }

  public borrarVideo() {
    this.videoYoutubeGuardar = "";
    this.videoPorGuardar = "";
    this.data.video = "";
    this.videoYoutube = "";
  }

  public opcionCondicionProducto(condicion) {
    this.Producto.Condicion = condicion;
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


  public opcionGarantia(garantia) {
    // console.log("Garantia", garantia)
    this.Oferta.Garantia = garantia;
  }


  public opcionVariaciones(bandera) {
    this.banderaVariaciones = bandera;
    this.vectorOpciones = [];
  }


  public agregarOpcionesProducto() {
    this.vectorOpciones.push(1);
    this.color.push(this.Variantes[this.Variantes.length-1].Color);

    this.vectorBanderaAgregarImagen.push(false);
    debugger;
    this.Variantes.push(new Variante( this.color[this.Variantes.length-1],this.Variantes[this.Variantes.length-1].Talla, this.Variantes[this.Variantes.length-1].Material,null, this.Variantes[this.Variantes.length-1].Stock, this.Variantes[this.Variantes.length-1].Cod_Unidad, 0));
    this.Imagenes_Producto.push([]);
    this.imagenes.push([]);
    // console.log("asdasd");
  }

  public borrarOpcionesProducto(pocicion: number) {

    this.vectorOpciones.splice(pocicion, 1);
    this.Variantes.splice(pocicion + 1, 1);
    this.Imagenes_Producto[pocicion + 1] = [];
    this.imagenes.splice(pocicion + 1);
    this.vectorBanderaAgregarImagen[pocicion + 1] = false;


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
      if (!(e instanceof HttpErrorResponse)){
        console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
        console.log("error como objeto:"+ e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }

  }


  public busquedaCategoria3(busqueda, event, c22, i) {

    let elemento = document.getElementById('labelcheckCategoria2' + i) as HTMLElement;
    let banderaSeleccionarCategoria:boolean = false;
    this.c3.forEach( c33 => {
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


  public busquedaCategoria2(busqueda) {
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

  public async getUnidadesMedida() {
    try {
      let response = await this._unidadesMedidaServicio.getUnidadesMedida().toPromise();
      this.unidades = response.data;

    } catch (e) {
      if (!(e instanceof HttpErrorResponse)){
        console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
        console.log("error como objeto:"+ e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
  }

  public cambiarColor(color: string, indice): Cmyk {
    const hsva = this.cpService.stringToHsva(color);
    const rgba = this.cpService.hsvaToRgba(hsva);
    // console.log(color);
    // console.log(rgba);
    this.Variantes[indice].Color = color;
    // console.log("Variante despuez de color", this.Variantes[indice]);
    return this.cpService.rgbaToCmyk(rgba);
  }

  public eliminarCategoria(cc) {
    debugger
    if (cc.TIPO == "C3") {
      let elemento3 = document.getElementById('labelcheckCategoria3' + cc.i) as HTMLElement;
      elemento3.classList.remove('chip2-alternativo')
      elemento3.classList.add('chip2', 'col', 'btn', 'btn-light');
    } else if (cc.TIPO == "C2") {
      let elemento2 = document.getElementById('labelcheckCategoria2' + cc.i) as HTMLElement;
      elemento2.classList.remove('chip-alternativo')
      elemento2.classList.add('chip', 'col', 'btn', 'btn-light');
    }
    this.categoriasSeleccionadas.delete(cc);

  }

  public abrirModalVideoYoutube(content) {
    this.modalService.open(content, {centered: true, size: 'md'});
  }


  public getVideoIframe() {
    let url = this.direccionVideoYoutube;
    var video, results;

    if (url === null) {
      return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    video = (results === null) ? url : results[1];
    delete this.videoPorGuardar;
    this.videoYoutube = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);
    delete this.videoPorGuardar;
    this.data.video = "";
  }

  public resetearVideoYoutube() {
    this.videoYoutube = null;
  }


  public async publicarProducto() {
    let banderaConfiguracion:boolean=true;
    try {
      if (this.identidadTienda.OPCION_ENVIOs.length == 0) {
        banderaConfiguracion=false;
        this.mostrarToast("Asegúrate de tener configurado tus métodos de envio antes de empezar a publicar tus productos", "fa fa-truck fa-2x");
      }
      if (this.identidadTienda.METODO_PAGOs.length == 0) {
        banderaConfiguracion=false;
        this.mostrarToast("Asegúrate de tener configurado tus métodos de pago antes de empezar a publicar tus productos", "fas fa-credit-card fa-2x");
      }
      this.loading = true;
      if(banderaConfiguracion){
      if (this.validar()) {
        if (this.videoYoutube) {
          this.videoYoutubeGuardar = new Imagen_Producto('Video', 'youtube', this.direccionVideoYoutube, 0);
          debugger;
          this.Imagenes_Producto[0].push(this.videoYoutubeGuardar);
          this.videoPorGuardar = "";
        } else if (this.videoPorGuardar) {
          this.Imagenes_Producto[0].push(this.videoPorGuardar);
        }
        this.categoriasEnviar = [];
        for (let categorias of this.categoriasSeleccionadas) {
          this.categoriasEnviar.push(categorias['ID_CATEGORIA']);
        }
        this.guardarProducto();

      }
      }
      this.loading = false;
    } catch
      (e) {
      this.loading = false;
      if (!(e instanceof HttpErrorResponse)){
        console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
        console.log("error como objeto:"+ e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
  }

  public async guardarProducto() {

    Swal.fire({
      title: '<header class="login100-form-title-registro mb-o"><h5 class="card-title"><strong>¿Estas seguro?</strong></h5></header>',
      text: "El producto será registrado y publicado en su tienda asegúrate de que los datos sean correctos",
      icon: 'warning',
      position: 'center',
      width: 600,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-primary px-3',
        container: 'my-swal',
        cancelButton: 'btn btn-light px-3 ml-5',
      }
    }).then(async (result) => {
      if (result.value) {
        try {
          let response = await this._productoServicio.saveProducto(this.Oferta, this.Producto, this.Variantes, this.Imagenes_Producto, this.categoriasEnviar).toPromise();
          this.mensageCorrecto(response.message);
          this.cancelar();
          this.loading = false;
        } catch (e) {
          this.loading = false;
          if (!(e instanceof HttpErrorResponse)){
            console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
            console.log("error como objeto:"+ e);
            if (JSON.stringify(e) === '{}')
              this.mensageError(e);
            else this.mensageError(JSON.stringify(e));
          }
        }
      }
    })


  }

  validarFormularios() {
    let bandera=true;
   for(let i in this.vectorOpciones){
     if(document.forms["formVariaciones" + i]!=null) {
       if (document.forms["formVariaciones" + i].checkValidity()) {
         bandera = true;
       } else {
         bandera = false;
       }
     }
   }

   return bandera;
  }

  public validar(): boolean {
    this.banderaValidaciones = true;
    debugger;
    if (/*this.imagenes.filter(v => v.length > 0).length == this.imagenes.length */this.imagenes[0].length>0 && this.categoriasSeleccionadas.size > 0 && document.forms["formInformacion"].checkValidity()
      && document.forms["formInventario"].checkValidity() && document.forms["formPrecios"].checkValidity()) {
      if (document.forms["formVariaciones0"] != null) {
        if (this.validarFormularios()) {
          return true;
        } else {
          let body = document.getElementById('body') as HTMLElement;
          window.scrollTo(0, 0);
          body.scrollTo(0, 0);

          this.toastr.error('<div class="row no-gutters"><p class="col-12 LetrasToastInfo">Existe errores en el formulario por favor revísalo nuevamente</p></div>', "Error!",
            {positionClass: 'toast-top-right', enableHtml: true, closeButton: true, disableTimeOut: false});
          return false
        }
      } else {
        return true;
      }
    } else {
      let body = document.getElementById('body') as HTMLElement;
      body.scrollTo(0, 0);
      window.scrollTo(0, 0);
      this.toastr.error('<div class="row no-gutters"><p class="col-12 LetrasToastInfo">Existe errores en el formulario por favor revísalo nuevamente</p></div>', "Error!",
        {positionClass: 'toast-top-right', enableHtml: true, closeButton: true, disableTimeOut: false});
      return false
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


  mensageCorrecto(mensaje) {
    Swal.fire({
      icon: 'success',
      title: '<header class="login100-form-title-registro"><h5 class="card-title">!Correcto..</h5></header>',
      text: mensaje,
      position: 'center',
      width: 600,
      buttonsStyling: false,
    
      customClass: {
        confirmButton: 'btn btn-primary px-5',
        //icon:'sm'
      }
    });
  }


  formatear(element) {
    let valor = this.cp.transform(element.target.value, '$',);
    //let alter=formatCurrency(element.target.value,'USD',getCurrencySymbol('USD', 'wide'));
    if (valor) {
      let valor2 = valor.split("$")
      element.target.value = valor2[1].replace(',', "");
    }
  }




  agregarImagenesVariante(event, i){
    if (event.target.checked) {
      this.vBanderaAgregarImagenesVariante[i] =true;
    } else {
      this.vBanderaAgregarImagenesVariante[i] =false;
      this.imagenes[i+1]=[];
     this.vectorBanderaAgregarImagen[i+1]=false
    }

  }

}


