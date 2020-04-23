import {Component, OnDestroy, OnInit} from '@angular/core';
import {Agente} from "../../modelos/agente";
import {DpaServicio} from "../../servicios/dpa.servicio";
import {AgenteServicio} from "../../servicios/agente.servicio";
//import Swal from 'sweetalert2'
//import swal from 'sweetalert2/src/sweetalert2.js'
import Swal from 'sweetalert2'

declare const require: any;
const places = require("../../../../node_modules/places.js/dist/cdn/places.js");

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})

export class RegistroComponent implements OnInit, OnDestroy {

  private emailPattern: any = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$";
  public soloLetrasPattern: any = "[ a-zA-ZÑñáéíóúÁÉÍÓÚ ][ a-zA-ZÑñáéíóúÁÉÍÓÚ ]*$[0-9]{0}";
  private LetrasNumerosPattern: any = "[ .aA-zZ 0-9 ][ .aA-zZ 0-9 ]*$";
  private soloNumerosPattern: any = "[0-9][0-9]*$[A-Z]{0}";
  public provincias;
  public ciudades;
  public ComprarContrasenia;
  public Agente;

  //banderas
  public banderToast: boolean=false;
  public banderToastCedula: boolean=false;
  public banderDirecciones: boolean = false;
  public bandera:boolean = false;
  public loading: boolean = false;
  public bandetTipo: boolean=true;

  constructor(private _dpaServicio: DpaServicio, private _agenteServicio: AgenteServicio) {
    this.Agente = new Agente(null, null, null,
      null, null, null, 1, null, null,
      null, null, null, null);
  }

   ngOnInit() {
    this.getDpaProvincias("P");

  }

  ngOnDestroy() {
    delete this.Agente;
  }

  selectTipoAgente() {
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
    this.loading = true;
    if (validador == "0") {
      this.banderToast = false;
      this.bandetTipo == true ? this.Agente.Tipo = 'Persona' : this.Agente.Tipo = 'Empresa';

      if (this.validarCedula() == true || this.Agente.Tipo == "Empresa") {
        this.banderToastCedula = false;
        try {
          let response = await this._agenteServicio.registrarAgente(this.Agente).toPromise();
          document.forms["formRegistro"].reset();
          window.scroll(0, 0);
          this.mensageCorrecto(response['message']);
          this.loading = false;
        } catch (e) {
          console.log("error:" + JSON.stringify((e).error.message));
          if (JSON.stringify((e).error.message))
            this.mensageError(JSON.stringify((e).error.message));
          else this.mensageError("Error de conexión intentelo mas tarde");
          this.loading = false;
        }
      } else {
        this.banderToast = false;
        this.banderToastCedula = true;
        window.scroll(0, 0);
        this.loading = false;
      }
    } else {
      this.banderToastCedula = false;
      this.banderToast = true;
      window.scroll(0, 0);
      this.loading = false;

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


  activarDireccion() {

    this.bandera = true;
    this.banderDirecciones = !this.banderDirecciones;
    if (!this.banderDirecciones) {
      this.Agente.Num_Cod_Postal = null;
      this.Agente.Num_Casa_Agente = null;
      this.Agente.Calle_Principal_Agente = null;
      this.Agente.Calle_Secundaria_Agente = null;
      this.Agente.Provincia=null;
      this.Agente.Ciudad=null;
    }
  }


  buscadorDirecciones() {

    if (this.bandera == true) {

      var placesAutocomplete = places({
        container: document.querySelector('#CallePrincipal'),
        templates: {
          value: function (suggestion) {
            return suggestion.name;
          }
        }
      }).configure({
        type: 'address',
        countries: ['ec'],


      });
      placesAutocomplete.on('change', (e) => {
        console.log(e.suggestion)
      });

      var placesAutocomplete2 = places({
        container: document.querySelector('#calleSecundaria'),
        templates: {
          value: function (suggestion) {
            return suggestion.name;
          }
        }
      }).configure({
        type: 'address',
        countries: ['ec'],


      });
      placesAutocomplete2.on('change', (e) => {
        console.log(e.suggestion)
      });
      this.bandera = false;

    }
    document.getElementById('CallePrincipal').focus();
  }


  mensageError(mensaje) {
    Swal.fire({
      icon: 'error',
      title: '<header class="login100-form-title-registro"><h5 class="card-title">!Error..</h5></header>',
      text: mensaje,
      position: 'center',
      width: 600,
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-primary px-5',
        //icon:'sm'
      }
    });
  }



  mensageCorrecto(mensaje) {
    Swal.fire({
      icon: 'success',
      title: '<header class="login100-form-title-registro"><h5 class="card-title">!Correcto..</h5></header>',
      text: mensaje,
      position: 'center',
      width: 600,
      buttonsStyling: false,
      //footer: '<a href="http://localhost:4200/loguin"><b><u>Autentificate Ahora</u></b></a>',
      customClass: {
        confirmButton: 'btn btn-primary px-5',
        //icon:'sm'
      }
    });
  }
}
