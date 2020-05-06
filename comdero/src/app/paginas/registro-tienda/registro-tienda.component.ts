import {Component, DoCheck, ElementRef, OnDestroy, OnInit, OnChanges, Renderer2} from '@angular/core';

import {Sucursal} from "../../modelos/sucursal";
import {Tienda} from "../../modelos/tienda";
import {DpaServicio} from "../../servicios/dpa.servicio";
import {AgenteServicio} from "../../servicios/agente.servicio";
import Swal from 'sweetalert2'

import {environment} from "../../../environments/environment.prod";
import * as Mapboxgl from 'mapbox-gl';
import {toNumber} from "ngx-bootstrap/timepicker/timepicker.utils";

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

  //Mapa
  mapa: Array<Mapboxgl.Map> = new Array<Mapboxgl.Map>();

  public vectorOpciones: Array<number> = [1, 1]; // las dos formas swon validas pero la activa es ams facil
  /*public vectorOpciones=new Array(0);*/

  public banderBotones: boolean = true;         /*Botones de Sucursales*/

  constructor(private _dpaServicio: DpaServicio, private renderer: Renderer2) {
    this.Tienda = new Tienda(null, null, null, null,
      null, null, null, null, null, null);

    this.Sucursal = new Sucursal(null, null, null, null,
      null, null, null, null);
  }

  async ngOnInit() {
    await this.getDpaProvincias("P");
  }

  public contSucursal = 0;
  public banderaSucursal: boolean = true;

  public mapas() {
    this.banderaSucursal = false;
    Mapboxgl.accessToken = environment.mapboxkey;
    this.mapa[this.contSucursal] = new Mapboxgl.Map({
      container: 'mapa-mapbox' + this.contSucursal.toString(), // Id del container
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-78.5248, -0.22521], // Coordenadas que aparece centrado
      zoom: 12 // zoom
    });

    this.mapa[this.contSucursal].addControl(new Mapboxgl.NavigationControl());
    this.mapa[this.contSucursal].addControl(new Mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));
    this.contSucursal++;
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

  public async agregarOpciones() {
    this.vectorOpciones.push(1);
    this.mapas();
  }

  public borrarOpciones(pocicion: number) {
    this.vectorOpciones.splice(pocicion, 1)
  }

  public desdeCasa(){
    this.banderaSucursal = true;
    this.contSucursal = 0;
  }
}
