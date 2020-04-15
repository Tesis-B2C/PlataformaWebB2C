import {Component, DoCheck, OnDestroy, OnInit} from '@angular/core';
import {Tienda} from "../../modelos/tienda";
import {Sucursal} from "../../modelos/sucursal";
import {DpaServicio} from "../../servicios/dpa.servicio";
import {AgenteServicio} from "../../servicios/agente.servicio";
import Swal from 'sweetalert2'
declare const require: any;
const places = require("../../../../node_modules/places.js/dist/cdn/places.js");

@Component({
  selector: 'app-registro-tienda',
  templateUrl: './registro-tienda.component.html',
  styleUrls: ['./registro-tienda.component.css']
})

export class RegistroTiendaComponent implements OnInit {
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
  private emailPattern: any = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$";
  private urlPattern: any = "(https?://)?([\\\\da-z.-]+)\\\\.([a-z.]{2,6})[/\\\\w .-]*/?";

  public provincias;
  public ciudades;

  constructor(private _dpaServicio: DpaServicio) {
    this.Tienda = new Tienda(null, null,null,null,
      null,null, null,null,null,null);

    this.Sucursal = new Sucursal(null, null,null,null,
      null, null,null,null);
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
}
