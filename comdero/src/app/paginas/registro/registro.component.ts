import {Component, OnDestroy, OnInit} from '@angular/core';
import {Agente} from "../modelos/agente";
import {DpaServicio} from "../../servicios/dpa.servicio"
import {AgenteServicio} from "../../servicios/agente.servicio"

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})

export class RegistroComponent implements OnInit, OnDestroy {
  public bandetTipo;
  public Agente;
  private emailPattern: any = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$";
  public soloLetrasPattern: any = "[ a-zA-ZÑñ ][ a-zA-ZÑñ ]*$[0-9]{0}";
  private LetrasNumerosPattern: any = "[ .a-z 0-9 ][ .a-z 0-9 ]*$";
  private soloNumerosPattern: any = "[0-9][0-9]*$[A-Z]{0}";
  public banderToast: boolean;
  public banderToastCedula: boolean;
  public provincias;
  public ciudades;
  public ComprarContrasenia;

  constructor(private _dpaServicio: DpaServicio, private _agenteServicio: AgenteServicio) {
    this.Agente = new Agente(null, null, null,
      null, null, null, 0, null, null,
      null, null,);
  }

  async ngOnInit() {
    console.log("Inicio Registro");
    this.bandetTipo = true;
    this.banderToast = false;
    this.banderToastCedula = false;
    await this.getDpaProvincias("P");
  }

  ngOnDestroy() {
    delete this.Agente;
    console.log("Destruccion Registro");
  }

  selectAdminsitrador() {
    this.bandetTipo = !this.bandetTipo;
    console.log(this.bandetTipo);
  }

  validarCedula() {
    var cad: any = this.Agente.Id_Agente;
    var i;

    var total = 0;
    var longitud = cad.length;
    var longcheck = longitud - 1;
    if (cad !== "" && longitud === 10) {
      for (i = 0; i < longcheck; i++) {
        if (i % 2 === 0) {
          var aux = cad.charAt(i) * 2;
          if (aux > 9) aux -= 9;
          total += aux;
        } else {
          total += parseInt(cad.charAt(i)); // parseInt o concatenará en lugar de sumar
        }
      }
      total = total % 10 ? 10 - total % 10 : 0;

      if (cad.charAt(longitud - 1) == total) {
        return true;
      } else {
        this.Agente.Id_Agente = "";
        return false;
      }
    }
  }

  async registrarAgente(validador) {
    console.log(validador);
    if (validador == "0") {
      this.banderToast = false;
      this.bandetTipo == true ? this.Agente.Tipo = 'Persona' : this.Agente.Tipo = 'Empresa';
      if (this.validarCedula() == true || this.Agente.Tipo == "Empresa") {
        this.banderToastCedula = false;
        try {
          let response = await this._agenteServicio.registrarAgente(this.Agente).toPromise();
          document.forms["formRegistro"].reset();
        } catch (e) {
          console.log("error:" + JSON.stringify((e).error.message));
        }
      } else {
        this.banderToast = false;
        this.banderToastCedula = true;
        window.scroll(0, 0);
      }
    } else {
      this.banderToastCedula = false;
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

  async getDpaCiudades(buscar) {
    try {
      let response = await this._dpaServicio.getDpaCiudades(buscar).toPromise();
      this.ciudades = response.data;
    } catch (e) {
      console.log("error:" + JSON.stringify((e).error.message));
    }
  }


}
