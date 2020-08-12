import {Component, OnInit} from '@angular/core';
import {DpaServicio} from "../../../servicios/dpa.servicio";
import {AgenteServicio} from "../../../servicios/agente.servicio";
import {Agente} from "../../../modelos/agente";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {ToastrService} from 'ngx-toastr';
import {CorreoServicio} from "../../../servicios/correo.servicio";

declare const require: any;
const places = require("../../../../../node_modules/places.js/dist/cdn/places.js");

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.css']
})


export class DatosPersonalesComponent implements OnInit {
  private emailPattern: any = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$";
  public soloLetrasPattern: any = "[ a-zA-ZÑñáéíóúÁÉÍÓÚ ][ a-zA-ZÑñáéíóúÁÉÍÓÚ ]*$[0-9]{0}";
  private LetrasNumerosPattern: any = "[ .aA-zZ 0-9 ][ .aA-zZ 0-9 ]*$";
  private soloNumerosPattern: any = "[0-9][0-9]*$[A-Z]{0}";

  public select_ciudad: boolean = false;
  public banderaTipo: boolean;
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
  public codigo;
  public loading: boolean = false;
  public objetoEmail = {
    asunto: null,
    correo: null,
    codigo: null
  };

  constructor(private _correoServicio: CorreoServicio, public toastr: ToastrService, private _dpaServicio: DpaServicio, private _agenteServicio: AgenteServicio, private modalService: NgbModal) {
    this.EditarAgente = new Agente(null, null, null,
      null, null, null, 0, null, null,
      null, null, null, null);
  }

  ngOnInit() {
    this.getDpaProvincias("P");
    this.identidad = this._agenteServicio.getIdentity();
    this.iniciarEdicion();
    this.comprobarTipoPersona();
  }

  public mostrarToast(mensaje, icono) {
    this.toastr.error('<div class="row no-gutters"><p class="col-12 LetrasToastInfo"><strong>!Error</strong><br>' + mensaje + '</p> </div>', "",
      {positionClass: 'toast-top-right', enableHtml: true, closeButton: true});
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
      let response = await this._dpaServicio.getDpaCiudades(buscar).toPromise();
      this.ciudades = response.data;
    } catch (e) {
      console.log("error:" + JSON.stringify((e).error.message));
    }
  }

  async seleccionarCiudad(event) {
    this.select_ciudad = false;
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

  public cancelarEdicion() {
    this.select_ciudad = false;
    this.banderaTipo = false;
    this.ciudades = null;
    this.bandera = true;
    this.ciudad = "";
    this.provincia = "";
    this.EditarAgente = "";
    this.banderaEdicionDeshabilitada = true;
    this.banderaPasoUnoCambiarCorreo = true;
    this.banderaPasoDosCambiarCorreo = false;
    this.Correo = "";
    this.codigo = "";
    this.loading = false;
    this.objetoEmail = {
      asunto: null,
      correo: null,
      codigo: null
    };

    this.EditarAgente = new Agente(null, null, null,
      null, null, null, 0, null, null,
      null, null, null, null);

    this.identidad = this._agenteServicio.getIdentity();
    this.iniciarEdicion();
    this.comprobarTipoPersona();
  }

  public iniciarEdicion() {
    if (this.identidad.DPA) {
      this.ciudad = this.identidad.DPA.NOMBRE + ' (Actual)';
      this.provincia = this.identidad.DPA.DPAP.NOMBRE + ' (Actual)';
      this.EditarAgente.Ciudad = this.identidad.DPA.COD_DPA;
    } else {
      this.ciudad = "";
      this.provincia = "";
    }
    this.banderaEdicionDeshabilitada = true;
    this.EditarAgente.Id_Agente = this.identidad.ID_AGENTE;
    this.EditarAgente.Num_Cod_Postal = this.identidad.NUM_COD_POSTAL;
    this.EditarAgente.Nombre = this.identidad.NOMBRE;
    this.EditarAgente.Telefono = this.identidad.TELEFONO;
    this.EditarAgente.Correo = this.identidad.CORREO;
    this.EditarAgente.Tipo = this.identidad.TIPO;
    if (this.identidad.TIPO == 'Persona')
      this.banderaTipo = true;
    if (this.identidad.TIPO == 'Empresa')
      this.banderaTipo = false;
    this.EditarAgente.Estado = this.identidad.ESTADO;

    this.EditarAgente.Calle_Principal_Agente = this.identidad.CALLE_PRINCIPAL_AGENTE;
    this.EditarAgente.Calle_Secundaria_Agente = this.identidad.CALLE_SECUNDARIA_AGENTE;
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

  public async pasoDosCambiarCorreo() {
    try {
      this.objetoEmail.correo = this.Correo;
      this.objetoEmail.asunto = 'Cambiar Correo';
      let codigo = Math.floor((Math.random() * 100) + 54);
      let response = await this._agenteServicio.verificarExistenciaCorreo(this.objetoEmail).toPromise();
      this.mensageCorrecto(response.message);
      this.objetoEmail.codigo = codigo;
      let responseCorreo = await this._correoServicio.correoCambioCorreo(this.objetoEmail).toPromise();
      localStorage.setItem("codigoCambioCorreo", JSON.stringify(codigo));
      //this.mensageCorrecto(responseCorreo.message);

      this.banderaPasoDosCambiarCorreo = true;
      this.banderaPasoUnoCambiarCorreo = false;
    } catch (e) {
      console.log("error:" + JSON.stringify((e).error.message));
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
    }
  }

  public async actualizarAgente() {
    try {
      debugger;
      if (document.forms['formActualizarDatos'].checkValidity()) {
        if (this.validarCedula() == true) {
          let aprobarCiudades: boolean = true;
          if ((this.ciudad == "" || this.ciudad == null) && this.ciudades)
            aprobarCiudades = false;

          if (aprobarCiudades) {
            this.loading = true;
            let response = await this._agenteServicio.actualizarAgente(this.EditarAgente).toPromise();
            let data = await this._agenteServicio.actualizarAgenteIdentity(this.identidad.CORREO).toPromise();

            localStorage.setItem("identity", JSON.stringify(data['data']));
            this.cancelarEdicion();
            this.mensageCorrecto(response['message']);
          } else {
            this.select_ciudad = true;
            this.mostrarToastError("Asegurate de seleccionar la ciudad de tu negocio.", "");
          }
        } else {
          if (this.banderaTipo) {
            this.mostrarToast("La cédula ingresada no es válida", "");
          } else if (!this.banderaTipo) {
            this.mostrarToast("El ruc ingresado no es válido", "");
          }
        }
      } else {
        this.mostrarToast("Al parecer existe errores en su formulario porfavor reviselo nuevamente", "");
      }
    } catch (e) {
      this.loading = false;
      console.log("error:" +e);
      if (JSON.stringify((e).error))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
    }
    this.loading = false;
  }

  public retroceder() {
    this.banderaPasoDosCambiarCorreo = false;
    this.banderaPasoUnoCambiarCorreo = true;
  }

  async cambioCorreoAgente() {
    try {
      if (this.codigo == localStorage.getItem('codigoCambioCorreo')) {
        let response = await this._agenteServicio.cambioCorreoAgente(this.identidad.CORREO, this.objetoEmail.correo).toPromise();
        let data = await this._agenteServicio.actualizarAgenteIdentity(this.objetoEmail.correo).toPromise();
        localStorage.setItem("identity", JSON.stringify(data['data']));
        this.identidad = this._agenteServicio.getIdentity();
        this.iniciarEdicion();
        this.mensageCorrecto(response['message']);
      } else {
        this.mensageError('Codigo incorrecto');
      }
    } catch (e) {
      console.log("error:" + JSON.stringify((e).error.message));
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
    }
  }

  validarCedula() {
    var cad: any = this.EditarAgente.Id_Agente;
    var i;
    var total = 0;
    var longitud;
    if (this.EditarAgente.Tipo == 'Persona')
      longitud = cad.length;
    else
      longitud = cad.length - 3;

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
        this.EditarAgente.Id_Agente = "";
        return false;
      }
    }
  }

  public async reEnviar() {
    try {
      let responseCorreo = await this._correoServicio.correoCambioCorreo(this.objetoEmail).toPromise();
      this.mensageCorrecto(responseCorreo.message);
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

  public mostrarToastError(mensaje, icono) {
    this.toastr.error('<div class="row no-gutters"><p align="justify" class="col-12 LetrasToastInfo"><strong>!Error</strong><br>' + mensaje + '</p> </div>', "",
      {positionClass: 'toast-top-right', enableHtml: true, closeButton: true});
  }
}
