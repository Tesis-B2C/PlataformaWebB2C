import {Component, OnInit, Renderer2} from '@angular/core';
import {Sucursal} from "../../modelos/sucursal";
import {Tienda} from "../../modelos/tienda";
import {DpaServicio} from "../../servicios/dpa.servicio";

import {environment} from "../../../environments/environment.prod";
import * as Mapboxgl from 'mapbox-gl';

declare const require: any;

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
  private emailPattern: any = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$";
  private soloNumerosPattern: any = "[0-9][0-9]*$[A-Z]{0}";
  public provincias;
  public ciudades;

  //Mapa
  mapa: Array<Mapboxgl.Map> = new Array<Mapboxgl.Map>();

  public vectorOpciones: Array<number> = [1, 1]; // las dos formas swon validas pero la activa es ams facil
  /*public vectorOpciones=new Array(0);*/

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
      center: [-78.5248, -0.22521], // Coordenadas que aparece centrado long. lat.
      zoom: 12 // zoom
    });
    //Controles
    this.mapa[this.contSucursal].addControl(new Mapboxgl.NavigationControl());
    this.mapa[this.contSucursal].addControl(new Mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));
    this.crearMarcador(-78.5248,-0.22521);
    this.contSucursal++;
  }

  crearMarcador(lng: number, lat:number){
    const marcador = new Mapboxgl.Marker({
      draggable: true
    })
      .setLngLat([-78.5248,-0.22521])
      .addTo(this.mapa[this.contSucursal]);

    /*Muestra coordenadas del puntero en consola
    marcador.on('drag',()=>{
      console.log(marcador.getLngLat());
    })*/

/*    function onDragEnd() {
      var lngLat = marcador.getLngLat();
      coordinates.style.display = 'block';
      coordinates.innerHTML =
        'Longitud: ' + lngLat.lng + '<br />Latitud: ' + lngLat.lat;
    }
    marcador.on('dragend', onDragEnd);*/
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
