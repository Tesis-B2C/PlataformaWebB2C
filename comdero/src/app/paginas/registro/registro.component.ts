import {Component, DoCheck, OnInit} from '@angular/core';
import {Agente} from "../modelos/agente";
import {DpaServicio} from "../../servicios/dpa.servicio"
import {AgenteServicio} from "../../servicios/agente.servicio"
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
  public ComprarContrasenia;

  constructor(private _dpaServicio: DpaServicio, private _agenteServicio:AgenteServicio) {
    this.Agente = new Agente(null, null, null,
      null, null, null, 0, null, null,
      null, null,);
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

  async registrarAgente(validador) {
    console.log(validador);
    if (validador == "0") {
      this.banderToast = false;
      try{
      let response = await this._agenteServicio.registrarAgente(this.Agente).toPromise();

      }catch (e) {
        console.log("error:" + JSON.stringify((e).error.message));
      }
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
