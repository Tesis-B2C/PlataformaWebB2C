import {Component, DoCheck, OnInit} from '@angular/core';
import {Agente} from "../modelos/agente";
import {DpaServicio} from "../../servicios/dpa.servicio"
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})

export class RegistroComponent implements OnInit, DoCheck {
  public bandetTipo;
  public Agente;
  private emailPattern: any = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$";
  public soloLetrasPattern: any = "[ a-zA-ZÑñ ][ a-zA-ZÑñ ]*$[0-9]{0}";
  private LetrasNumerosPattern: any = "[ .a-z 0-9 ][ .a-z 0-9 ]*$";
  private soloNumerosPattern: any = "[0-9][0-9]*$[A-Z]{0}";
  public banderToast: boolean;
  public provincias;
  public ciudades;


  constructor(private _dpaServicio: DpaServicio) {
    this.Agente = new Agente("", "", "",
      "", "", "", "", "", "",
      "", "",);
  }
  async ngOnInit() {
    console.log("!INIT");
    this.bandetTipo = true;
    this.banderToast = false;
    await this.getDpaProvincias("P");
  }

  ngDoCheck() {
  }

  selectAdminsitrador() {
    this.bandetTipo = !this.bandetTipo;
    console.log(this.bandetTipo);
  }

  registrarAgente(validador) {
    console.log(validador);
    if (validador == "0") {
      this.banderToast = false;
    } else {
      this.banderToast = true;
      window.scroll(0, 0);
    }
  }
  async getDpaProvincias(buscar) {
    try {
      let response = await this._dpaServicio.getDpaProvincias(buscar).toPromise();
      this.provincias = response.data;
    } catch (e) {
      console.log("error:" + JSON.stringify((e).error.message));
    }

  }
  async getDpaCiudades(buscar){

    try {
      let response = await this._dpaServicio.getDpaCiudades(buscar).toPromise();
      this.ciudades = response.data;
    } catch (e) {
      console.log("error:" + JSON.stringify((e).error.message));
    }
  }


}
