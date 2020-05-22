
import {Component, DoCheck, OnChanges, OnInit} from '@angular/core';
import {CategoriaServicio} from "../../../servicios/categoria.servicio";
import {UnidadMedidaServicio} from "../../../servicios/unidad_medida.servicio";
import {Cmyk, ColorPickerService} from "ngx-color-picker";
import {Oferta} from "../../../modelos/oferta";
import {Producto} from "../../../modelos/producto"
import {Variante} from "../../../modelos/variante"
import {Imagen_Producto} from "../../../modelos/imagen_producto"

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit, DoCheck, OnChanges {
  public videoPorGuardar;
  public Imagenes_Producto = [[]];
  public imagenes = [[]];
  public unidades: any;
  public vectorBanderaAgregarImagen = [false];
  public banderaMaximoImagenes: boolean = true;
  public banderaMensajeMaximoImagenes: boolean = false;
  public banderaMensajeMaximoVideo: boolean = false;
  public data: any = [];
  public banderaAnimacionVideo: boolean = false;

  // banderas de envios a domicilio
  // banderas de envios a domicilio
  // banderas de envios a domicilio
  public banderaEntregaDomicilioLocalidad: boolean = false;
  public banderaEntregaDomicilioFueraLocalidad: boolean = false;
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
  public categoriaEncontrada2 = new Set();
  public panelUno;
  public panelDos;
  // objetos
  public Oferta: Oferta;
  public Producto: Producto

  constructor(private _categoriaServicio: CategoriaServicio, private _unidadesMedidaServicio: UnidadMedidaServicio, private cpService: ColorPickerService) {
    this.Oferta = new Oferta(null, null, null, 1, null, null);
    this.Producto = new Producto(null, null, null, null, null, null, null, null);
    this.Variantes.push(new Variante(null, null, null, null, null, "unidades"));
  }

  ngOnInit() {
    this.getCategorias();
    this.getUnidadesMedida();
    this.panelUno = document.getElementById('panelUno') as HTMLElement;
    this.panelDos = document.getElementById('panelDos') as HTMLElement;

  }

  ngDoCheck(): void {
    this.panelDos.style.maxHeight = this.panelUno.offsetHeight + 'px';

  }

  ngOnChanges(): void {
    this.panelDos.style.maxHeight = this.panelUno.offsetHeight + 'px';
    console.log("height |", this.panelUno.offsetHeight + 'px')
  }

  public async subirImagenes(eventEntrante, indice) {
    if(this.imagenes[indice]==null){
      this.imagenes[indice]=[];
    }
    if (eventEntrante.target.files && eventEntrante.target.files[0]) {
      var filesAmount = eventEntrante.target.files.length;
      this.vectorBanderaAgregarImagen[indice] = true;
      if (filesAmount > 6) {
        this.banderaMensajeMaximoImagenes = true;
      } else {
        for (let i = 0; i < filesAmount; i++) {
          this.Imagenes_Producto[indice].push(new Imagen_Producto(eventEntrante.target.files[i].name, eventEntrante.target.files[i].type, null, eventEntrante.target.files[i].size));
          var reader = new FileReader();
          reader.onload = (event: any) => {
            if( this.imagenes[indice]!=null)
              this.imagenes[indice].push(event.target.result);
            document.forms["form"].reset();
          }
          await reader.readAsDataURL(eventEntrante.target.files[i]);
        }
        if (this.Imagenes_Producto[indice].length > 6) {
          this.imagenes[indice]=null;
          this.Imagenes_Producto[indice].splice(0,  this.Imagenes_Producto[indice].length);
          document.forms["form"].reset();
          this.vectorBanderaAgregarImagen[indice] = false;
          this.banderaMensajeMaximoImagenes = true;
        } else if (this.Imagenes_Producto[indice].length == 6) {
          this.banderaMensajeMaximoImagenes = false
          this.banderaMaximoImagenes = false;
        }
      }

    }

  }


  public subirVideo(event) {
    this.banderaAnimacionVideo = true;
    let fileList: FileList = event.target.files;
    this.data = {};
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.videoPorGuardar=new Imagen_Producto(file.name, file.type, null, file.size);

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
    this.Imagenes_Producto[indice].splice(imagen, 1);
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

  public opcionReservarProducto(event) {
    if (event.target.checked) {
      this.Oferta.Reserva = 0;
    } else {
      this.Oferta.Reserva = 1;
    }

  }

  public opcionRetiroPersona(retiroPersona) {
    console.log("Envio persona", retiroPersona);
    this.Oferta.Ofrece_Retiro_Personal = retiroPersona;
  }

  public opcionEntregaLocalidad(entregaLocalidad) {

    this.banderaEntregaDomicilioLocalidad = !this.banderaEntregaDomicilioLocalidad;
    console.log("Entrega localidad", entregaLocalidad);
    this.Oferta.Ofrece_Envio_Local = entregaLocalidad;

  }

  public opcionEntregaFueraLocalidad(entregaFueraLocalidad) {
    this.banderaEntregaDomicilioFueraLocalidad = !this.banderaEntregaDomicilioFueraLocalidad;
    this.vectorOpcionesEntregaFueraLocalidad = [1];
    console.log("Entrega fuera localidad", entregaFueraLocalidad);
    this.Oferta.Ofrece_Envio_Externo = entregaFueraLocalidad;
  }

  public opcionGarantia(garantia) {
    console.log("Garantia", garantia)
    this.Oferta.Garantia = garantia;
  }


  public opcionVariaciones() {
    this.banderaVariaciones = !this.banderaVariaciones;
    this.vectorOpciones = [];
  }


  public agregarOpcionesProducto() {
    this.vectorOpciones.push(1);
    this.color.push("#2889e9");
    this.vectorBanderaAgregarImagen.push(false);
    this.Variantes.push(new Variante(null, null, null, null, null, "unidades"));
    this.Imagenes_Producto.push([]);
    this.imagenes.push([]);
    console.log("asdasd");
  }

  public borrarOpcionesProducto(pocicion: number) {

    this.vectorOpciones.splice(pocicion, 1);
    this.Variantes.splice(pocicion + 1, 1);
    this.Imagenes_Producto[pocicion + 1] = [];
    this.imagenes[pocicion + 1] = [];
    this.vectorBanderaAgregarImagen[pocicion + 1] = false;


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

  public cambiarColor(color: string, indice): Cmyk {
    const hsva = this.cpService.stringToHsva(color);
    const rgba = this.cpService.hsvaToRgba(hsva);
    console.log(color);
    console.log(rgba);
    this.Variantes[indice].Color = rgba;
    console.log("Variante despuez de color", this.Variantes[indice]);
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
