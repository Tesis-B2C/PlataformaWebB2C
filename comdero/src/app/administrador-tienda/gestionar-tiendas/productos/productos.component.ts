import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {CategoriaServicio} from "../../../servicios/categoria.servicio";
import {UnidadMedidaServicio} from "../../../servicios/unidad_medida.servicio";
import {Cmyk, ColorPickerService} from "ngx-color-picker";

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  public htmlcomponent;
  public url2 = "./../assets/images/imagenes-fondo.png";
  public imagenes = [[]];
  public banderaAgregarImagen: boolean = false;
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
  public color=['#2889e9'] ;
  public vectorIconos = ['fa fa-charging-station', 'fa fa-tshirt',
    'fa fa-ring', 'fa fa-baby-carriage', 'fa fa-home',
    'fa fa-gem', 'fa fa-palette', 'fa fa-laptop',
    'fa fa-car', 'fa fa-dumbbell', 'fa fa-book',
    'fa fa-dog', 'fa fa-gamepad', 'fa fa-grin-stars', 'fa fa-heartbeat', 'fa fa-building', 'fa fa-tractor'];

  constructor(private _categoriaServicio: CategoriaServicio, private _unidadesMedidaServicio: UnidadMedidaServicio,
              public vcRef: ViewContainerRef,
              private cpService: ColorPickerService) {

  }


  ngOnInit() {

console.log("vecvtorboo",this.vectorBanderaAgregarImagen[0]);

    this.getCategorias();
    this.getUnidadesMedida();
  }

  public subirImagenes(event, indice) {
    debugger
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
    debugger
    this.imagenes[indice].splice(imagen, 1);
    document.forms["form"].reset();
  }

  public opcionRetiroPersona(retiroPersona) {
    console.log("Envio persona", retiroPersona);
  }

  public opcionEntregaLocalidad(entregaLocalidad) {

    this.banderaEntregaDomicilioLocalidad = !this.banderaEntregaDomicilioLocalidad;


  }

  public opcionEntregaFueraLocalidad(entregaFueraLocalidad) {
    this.banderaEntregaDomicilioFueraLocalidad = !this.banderaEntregaDomicilioFueraLocalidad;
    this.vectorOpcionesEntregaFueraLocalidad = [1];
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

  public c1 = [];
  public c2 = [];
  public c3 = [];

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

  categoriaEncontrada = new Set();

  busquedaCate(busqueda) {
    this.c3.forEach(c33 => {
      if (c33.CAT_ID_CATEGORIA == busqueda)
        this.categoriaEncontrada.add(c33);
    });
    console.log(this.categoriaEncontrada)
  }

  categoriaEncontrada2 = new Set();

  busquedaCate2(busqueda) {

    this.c2.forEach(c22 => {
      if (c22.CAT_ID_CATEGORIA == busqueda)
        this.categoriaEncontrada2.add(c22);
    });

  }

  cc(event) {
    event.srcElement.style.backgroundColor = 'red'
    console.log(event)

  }

  public unidades: any;

  async getUnidadesMedida() {

    try {
      let response = await this._unidadesMedidaServicio.getUnidadesMedida().toPromise();
      this.unidades = response.data;
      console.log("unidades", this.unidades)
    } catch (e) {
      console.log("error:" + JSON.stringify((e).error.message));
    }

  }
  public onChangeColor(color: string): Cmyk {
    const hsva = this.cpService.stringToHsva(color);

    const rgba = this.cpService.hsvaToRgba(hsva);


    console.log(color);
    console.log(rgba);

    return this.cpService.rgbaToCmyk(rgba);
  }
}
