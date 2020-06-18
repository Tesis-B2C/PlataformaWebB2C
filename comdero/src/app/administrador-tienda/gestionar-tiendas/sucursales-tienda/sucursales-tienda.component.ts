import { Component, OnInit } from '@angular/core';
import {Sucursal} from "../../../modelos/sucursal";
import {DpaServicio} from "../../../servicios/dpa.servicio";

@Component({
  selector: 'app-sucursales-tienda',
  templateUrl: './sucursales-tienda.component.html',
  styleUrls: ['./sucursales-tienda.component.css']
})
export class SucursalesTiendaComponent implements OnInit {
  private soloNumerosPattern: any = "[0-9][0-9]*$[A-Z]{0}";

  public provincias;
  public ciudades = [];
  public vectorOpciones: Array<number> = [1];
  public Sucursales = [];

  constructor(private _dpaServicio: DpaServicio) {
    this.Sucursales.push(new Sucursal(null, null, null, null, null, null, null, null, 'Negocio'));

  }

  ngOnInit() {
    this.getDpaProvincias("P");
  }

  async getDpaProvincias(buscar) {
    try {
      let response = await this._dpaServicio.getDpaProvincias(buscar).toPromise();
      console.log("RESPONSE provincia" + response.data);
      this.provincias = response.data;
    } catch (e) {
      console.log("error:" + JSON.stringify((e).error.message));
    }
  }

  async getDpaCiudades(buscar, indiceCiudad) {
    try {
      let response = await this._dpaServicio.getDpaCiudades(buscar).toPromise();
      console.log("RESPONSE" + response.data);
      this.ciudades[indiceCiudad] = response.data;
    } catch (e) {
      console.log("error:" + JSON.stringify((e).error.message));
    }
  }

  /*Banderas de Negocio o Casa*/
  public bandAgregarSuc: boolean = true;
  public banderaCasa: boolean = false;
  public banderaEspacioFisico: boolean = true;
  public btnEspacioFisico: boolean = true;
  public btnCasa: boolean = false;

  public desdeNegocio() {
    this.ciudades = [];
    this.vectorOpciones = [1];
    this.Sucursales = [];
    this.banderaEspacioFisico = true;
    this.banderaCasa = false;

    this.bandAgregarSuc = true;
    this.btnEspacioFisico = true;
    this.btnCasa = false;

    this.Sucursales.push(new Sucursal(null, null, null, null, null, null, null, null, "Negocio"));
    console.log("NEGOCIO" + JSON.stringify(this.Sucursales));
  }

  public desdeCasa() {
    this.ciudades = [];
    this.vectorOpciones = [1];
    this.Sucursales = [];
    this.banderaCasa = true;
    this.banderaEspacioFisico = false;

    this.bandAgregarSuc = false;
    this.btnEspacioFisico = false;
    this.btnCasa = true;

    this.Sucursales.push(new Sucursal(null, null, null, null, null, null, null, null, "Casa"));
    console.log("CASA" + JSON.stringify(this.Sucursales));
  }


  public agregarSucursal() {
    this.vectorOpciones.push(1);
    this.Sucursales.push(new Sucursal(null, null, null, null, null, null, null, null, "Negocio"));
    console.log("negocio" + JSON.stringify(this.Sucursales));
  }

  public borrarOpciones(pocicion: number) {
    this.vectorOpciones.splice(pocicion, 1);
    this.Sucursales.splice(pocicion, 1);
    console.log("NEGOCIO" + JSON.stringify(this.Sucursales));
  }


}
