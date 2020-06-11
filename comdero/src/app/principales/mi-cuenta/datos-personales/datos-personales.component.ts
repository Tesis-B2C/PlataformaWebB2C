import {Component, OnInit} from '@angular/core';
import {DpaServicio} from "../../../servicios/dpa.servicio";
import {AgenteServicio} from "../../../servicios/agente.servicio";
import {Agente} from "../../../modelos/agente";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";

declare const require: any;
const places = require("../../../../../node_modules/places.js/dist/cdn/places.js");

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.css']
})


export class DatosPersonalesComponent implements OnInit {
  public banderaTipo: boolean = false;
  private emailPattern: any = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$";
  public soloLetrasPattern: any = "[ a-zA-ZÑñáéíóúÁÉÍÓÚ ][ a-zA-ZÑñáéíóúÁÉÍÓÚ ]*$[0-9]{0}";
  private LetrasNumerosPattern: any = "[ .aA-zZ 0-9 ][ .aA-zZ 0-9 ]*$";
  private soloNumerosPattern: any = "[0-9][0-9]*$[A-Z]{0}";
  public provincias;
  public ciudades;
  public identidad;
  public bandera: boolean = true;
  public ciudad;
  public provincia;
  public EditarAgente;
  public banderaEdicionDeshabilitada: boolean = true;
  public banderaPasoUnoCambiarCorreo: boolean = true;
  public banderaPasoDosCambiarCorreo: boolean = false;
  public Correo;

  constructor(private _dpaServicio: DpaServicio, private _agenteServicio: AgenteServicio, private modalService: NgbModal) {
    this.EditarAgente = new Agente(null, null, null,
      null, null, null, 0, null, null,
      null, null, null, null);
  }

  ngOnInit() {
    this.getDpaProvincias("P");
    this.identidad = this._agenteServicio.getIdentity();
    console.log("identidad", this.identidad)

    this.iniciarEdicion();

    this.comprobarTipoPersona();


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
      this.ciudad = null;
      this.provincia = null;
      let response = await this._dpaServicio.getDpaCiudades(buscar).toPromise();
      this.ciudades = response.data;
    } catch (e) {
      console.log("error:" + JSON.stringify((e).error.message));
    }
  }

  async seleccionarCiudad(event) {
    this.EditarAgente.Ciudad = event;
  }

  public buscadorDirecciones() {
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

  public iniciarEdicion() {
    this.banderaEdicionDeshabilitada = true;
    this.ciudad = this.identidad.DPA.NOMBRE + ' (Actual)';
    this.provincia = this.identidad.DPA.DPAP.NOMBRE + ' (Actual)';
    this.EditarAgente.Id_Agente = this.identidad.ID_AGENTE;
    this.EditarAgente.Num_Cod_Postal = this.identidad.NUM_COD_POSTAL;
    this.EditarAgente.Nombre = this.identidad.NOMBRE;
    this.EditarAgente.Telefono = this.identidad.TELEFONO;
    this.EditarAgente.Correo = this.identidad.CORREO;
    this.EditarAgente.Tipo = this.identidad.TIPO;
    this.EditarAgente.Estado = this.identidad.ESTADO;
    this.EditarAgente.Ciudad = this.identidad.DPA.COD_DPA;
    this.EditarAgente.Calle_Principal_Agente = this.identidad.CALLE_PRINCIPAL_AGENTE;
    this.EditarAgente.Num_Casa_Agente = this.identidad.NUM_CASA_AGENTE;
  }

  public comprobarTipoPersona() {
    if (this.identidad.TIPO == 'Persona') {
      this.banderaTipo = true;
    } else if (this.identidad == 'Empresa') {
      this.banderaTipo = false;
    }
  }

  public cambiarTipo(value) {
    debugger
    this.EditarAgente.Tipo = value;
    if (value == 'Persona') {
      this.banderaTipo = true;
    } else if (value == 'Empresa') {
      this.banderaTipo = false;
    }
  }

  public habilitarEdicion() {
    this.banderaEdicionDeshabilitada = false;
  }

  public editarCorreo(content) {
    this.modalService.open(content, {centered: true, size: 'md'});
    this.banderaPasoUnoCambiarCorreo = true;
    this.banderaPasoDosCambiarCorreo = false;
  }

  public pasoDosCambiarCorreo() {
    this.banderaPasoDosCambiarCorreo = true;
    this.banderaPasoUnoCambiarCorreo = false;
  }

  public actualizarAgente() {
    try {
      let response = this._agenteServicio.actualizarAgente(this.EditarAgente).toPromise();

      this.mensageCorrecto(response['message']);
    } catch (e) {
      console.log("error:" + JSON.stringify((e).error.message));
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");

    }
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
        confirmButton: 'btn btn-primary px-5'
        //icon:'sm'
      }


    });
  }
}

