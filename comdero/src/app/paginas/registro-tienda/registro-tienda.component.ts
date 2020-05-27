import {Component, OnInit } from '@angular/core';
import {Sucursal} from "../../modelos/sucursal";
import {Tienda} from "../../modelos/tienda";
import {DpaServicio} from "../../servicios/dpa.servicio";
import {Imagen_Producto} from "../../modelos/imagen_producto";

declare const require: any;

@Component({
  selector: 'app-registro-tienda',
  templateUrl: './registro-tienda.component.html',
  styleUrls: ['./registro-tienda.component.css']
})

export class RegistroTiendaComponent implements OnInit{
  public Tienda;
  public Sucursal;
  public htmlcomponent;

  public editorConfig = {
    "editable": true,
    "spellcheck": true,
    "height": "150px",
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

  private LetrasNumerosPattern: any = "[ .aA-zZ 0-9 ][ .aA-zZ 0-9 ]*$";
  private soloNumerosPattern: any = "[0-9][0-9]*$[A-Z]{0}";
  private urlPattern: any = "(https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})";
  public provincias;
  public ciudades;

  public vectorOpciones: Array<number> = [1]; // las dos formas swon validas pero la activa es ams facil
  /*public vectorOpciones=new Array(0);*/

  /*Banderas de Negocio o Casa*/
  public bandAgregarSuc: boolean = false;
  public banderaCasa: boolean = false;
  public btnEspacioFisico: boolean = false;
  public btnCasa: boolean = false;

  public filesToUpload: Array<File>;
  public url2;

  constructor(private _dpaServicio: DpaServicio) {
    this.Tienda = new Tienda(null, null, null, null,
      null, null, null, null, null, null);

    this.Sucursal = new Sucursal(null, null, null, null,
      null, null, null, null);
  }

  async ngOnInit() {
    await this.getDpaProvincias("P");
  }

  async getDpaProvincias(buscar) {
    try {
      let response = await this._dpaServicio.getDpaProvincias(buscar).toPromise();
      this.provincias = response.data;
    } catch (e) {
      console.log("error:" + JSON.stringify((e).error.message));
    }
  }

  async getDpaCiudades(buscar) {
    try {
      let response = await this._dpaServicio.getDpaCiudades(buscar).toPromise();
      this.ciudades = response.data;
    } catch (e) {
      console.log("error:" + JSON.stringify((e).error.message));
    }
  }

  public desdeNegocio() {
    this.banderaCasa = false;
    this.bandAgregarSuc=true;

    this.btnEspacioFisico = true;
    this.btnCasa = false;
  }

  public desdeCasa() {
    this.vectorOpciones=[1];
    this.banderaCasa = true;

    this.btnEspacioFisico = false;
    this.btnCasa = true;

  }

  public agregarSucursal() {
    this.vectorOpciones.push(1);
    console.log("negocio"+this.vectorOpciones);
  }

  public borrarOpciones(pocicion: number) {
    this.vectorOpciones.splice(pocicion,1);
  }

  readUrl(event: any) {
    this.filesToUpload = <Array<File>>event.target.files;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.url2 = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  //Imagenes
  public vectorBanderaAgregarImagen = [false];
  public imagenes = [[]];
  public Imagenes_Producto = [[]];

  public async subirImagenes(eventEntrante, indice) {
    if(this.imagenes[indice]==null){
      this.imagenes[indice]=[];
    }
    if (eventEntrante.target.files && eventEntrante.target.files[0]) {
      var filesAmount = eventEntrante.target.files.length;
      this.vectorBanderaAgregarImagen[indice] = true;
      if (filesAmount > 6) {
        //this.banderaMensajeMaximoImagenes = true;
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
          //this.banderaMensajeMaximoImagenes = true;
        } else if (this.Imagenes_Producto[indice].length == 6) {
          //this.banderaMensajeMaximoImagenes = false
          //this.banderaMaximoImagenes = false;
        }
      }
    }
  }


  public quitarImagenes(indice: any, imagen) {
    this.imagenes[indice].splice(imagen, 1);
    document.forms["form"].reset();
    this.Imagenes_Producto[indice].splice(imagen, 1);
  }


}
