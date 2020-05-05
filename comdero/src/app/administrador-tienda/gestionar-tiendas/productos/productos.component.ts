import {Component, OnInit} from '@angular/core';
import {CategoriaServicio} from "../../../servicios/categoria.servicio";
import {UnidadMedidaServicio} from "../../../servicios/unidad_medida.servicio";
import {Cmyk, ColorPickerService} from "ngx-color-picker";

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {


  public imagenes = [[]];
  public unidades: any;
  public vectorBanderaAgregarImagen = [false];
  public banderaMaximoImagenes: boolean = true;
  public banderaMensajeMaximoImagenes: boolean = false;
  public banderaMensajeMaximoVideo: boolean = false;
  public data: any = [];
  public banderaAnimacionVideo: boolean = false;

  // banderas de envios a domicilio
  public banderaEntregaDomicilioLocalidad: boolean = false;
  public banderaEntregaDomicilioFueraLocalidad: boolean = false;
  public banderaVariaciones: boolean = false;

  //
  public categorias: any;
  public editorConfig = {
    "editable": true,
    "spellcheck": true,
    "height": "100px",
    "minHeight": "100px",
    "width": "auto",
    "minWidth": "0",
    "translate": "yes",
    "enableToolbar": true,
    "showToolbar": true,
    "imageEndPoint": "",
    "toolbar": [
      ["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"],
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
  public vectorOpcionesEntregaLocal: Array<number> = [1];
  public vectorOpcionesEntregaFueraLocalidad: Array<number> = [1];
  public visible = true;
  public color = ['#2889e9'];
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
 public  categoriaEncontrada2 = new Set();
  constructor(private _categoriaServicio: CategoriaServicio, private _unidadesMedidaServicio: UnidadMedidaServicio, private cpService: ColorPickerService) {
  }

  ngOnInit() {
    this.getCategorias();
    this.getUnidadesMedida();
  }

  public subirImagenes(event, indice) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      if (filesAmount > 6) {
        this.banderaMensajeMaximoImagenes = true;
      } else {
        for (let i = 0; i < filesAmount; i++) {
          var reader = new FileReader();
          reader.onload = (event: any) => {
            console.log(event.target.result);
            this.imagenes.push([]);
            this.imagenes[indice].push(event.target.result);
            debugger
            this.vectorBanderaAgregarImagen[indice] = true;
            document.forms["form"].reset();
            if (this.imagenes[indice].length > 6) {
              this.imagenes[indice] = [];
              document.forms["form"].reset();
              this.vectorBanderaAgregarImagen[indice] = false;
              this.banderaMensajeMaximoImagenes = true;
            } else if (this.imagenes[indice].length == 6) {
              this.banderaMensajeMaximoImagenes = false
              this.banderaMaximoImagenes = false;
            }
          }
          reader.readAsDataURL(event.target.files[i]);
        }
      }

    }

  }


  public subirVideo($event) {
    this.banderaAnimacionVideo = true;
    debugger
    let fileList: FileList = $event.target.files;
    this.data = {};
    if (fileList.length > 0) {
      let file: File = fileList[0];
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
  }

  public opcionRetiroPersona(retiroPersona) {
    console.log("Envio persona", retiroPersona);
  }

  public opcionEntregaLocalidad(entregaLocalidad) {

    this.banderaEntregaDomicilioLocalidad = !this.banderaEntregaDomicilioLocalidad;
    console.log("Entrega localidad", entregaLocalidad);

  }

  public opcionEntregaFueraLocalidad(entregaFueraLocalidad) {
    this.banderaEntregaDomicilioFueraLocalidad = !this.banderaEntregaDomicilioFueraLocalidad;
    this.vectorOpcionesEntregaFueraLocalidad = [1];
    console.log("Entrega fuera localidad", entregaFueraLocalidad);
  }

  public opcionGarantia(garantia) {
    console.log("Garantia", garantia)
  }

  public opcionVariaciones() {
    this.banderaVariaciones = !this.banderaVariaciones;
    this.vectorOpciones = [];

  }


  public agregarOpcionesProducto() {
    this.vectorOpciones.push(1);
    this.color.push("#2889e9");
    this.vectorBanderaAgregarImagen.push(false);


  }

  public borrarOpcionesProducto(pocicion: number) {

    this.vectorOpciones.splice(pocicion, 1)
  }


  public agregarOpcionesEntregaFueraLocalidad() {
    this.vectorOpcionesEntregaFueraLocalidad.push(1);

  }

  public agregarOpcionesEntregaLocal() {
    this.vectorOpcionesEntregaLocal.push(1);

  }

  public borrarOpcionesEntregaFueraLocalidad(pocicion: number) {

    this.vectorOpcionesEntregaFueraLocalidad.splice(pocicion, 1)
  }

  public borrarOpcionesEntregaLocal(pocicion: number) {

    this.vectorOpcionesEntregaLocal.splice(pocicion, 1)
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

      console.log("c1", this.c1)
      console.log("c2", this.c2)
      console.log("c3", this.c3)

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

  public async getUnidadesMedida() {

    try {
      let response = await this._unidadesMedidaServicio.getUnidadesMedida().toPromise();
      this.unidades = response.data;
    } catch (e) {
      console.log("error:" + JSON.stringify((e).error.message));
    }

  }

  public cambiarColor(color: string): Cmyk {
    const hsva = this.cpService.stringToHsva(color);
    const rgba = this.cpService.hsvaToRgba(hsva);
    console.log(color);
    console.log(rgba);
    return this.cpService.rgbaToCmyk(rgba);
  }

  public eliminarCategoria(cc) {

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
}
