import {Component, OnInit } from '@angular/core';
import {Sucursal} from "../../modelos/sucursal";
import {Tienda} from "../../modelos/tienda";
import {DpaServicio} from "../../servicios/dpa.servicio";

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
  private emailPattern: any = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$";
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
}
