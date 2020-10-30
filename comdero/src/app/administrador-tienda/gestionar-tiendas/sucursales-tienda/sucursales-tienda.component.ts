import {Component, OnDestroy, OnInit} from '@angular/core';
import {Sucursal} from "../../../modelos/sucursal";
import {DpaServicio} from "../../../servicios/dpa.servicio";
import {ToastrService} from "ngx-toastr";
import {TiendaServicio} from "../../../servicios/tienda.servicio";
import Swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-sucursales-tienda',
  templateUrl: './sucursales-tienda.component.html',
  styleUrls: ['./sucursales-tienda.component.css']
})
export class SucursalesTiendaComponent implements OnInit, OnDestroy {
  public soloNumerosPattern: any = "[0-9][0-9]*$[A-Z]{0}";

  /*Variables Input*/
  public provinciaCasa = "";
  public ciudadCasa = "";
  public provinciaNegocio = [];
  public ciudadNegocio = [];

  /*Vector de Informacion Input*/
  public vectorCasa;
  public Sucursales = [];

  /*Variables para getProvincia y getCiudad*/
  public provincias;
  public ciudades = [];
  public provinciasCasa;
  public ciudadesCasa = [];

  public banderaEdicionDeshabilitadaNeg: boolean = true;
  public banderaEdicionDeshabilitadaCasa: boolean = true;

  public identidadTienda;
  public loading: boolean = false;

  /*Banderas de Negocio o Casa */
  public bandAgregarSuc: boolean = false;
  public banderaCasa: boolean = false;
  public banderaEspacioFisico: boolean = false;
  public btnEspacioFisico: boolean = false;
  public btnCasa: boolean = false;
  public banderaValidaciones: boolean = false;

  constructor(public _dpaServicio: DpaServicio, public toastr: ToastrService, public _tiendaServicio: TiendaServicio) {
  }

  ngOnInit() {
    this.getDpaProvincias("P");
    this.getDpaProvinciasCasa("P");
    this.identidadTienda = this._tiendaServicio.getIdentityTienda();
    this.iniciarEdicion();
  }

  ngOnDestroy() {
    delete this.Sucursales;
    delete this.vectorCasa;
    this.toastr.clear();
  }

  async getDpaProvincias(buscar) {
    try {
      let response = await this._dpaServicio.getDpaProvincias(buscar).toPromise();
      this.provincias = response.data;
    } catch (e) {
      if (!(e instanceof HttpErrorResponse)) {
        console.log("error Parseado:" + typeof (e) + JSON.stringify(e));
        console.log("error como objeto:" + e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
  }

  async getDpaCiudades(buscar, indiceCiudad) {
    try {
      this.ciudadNegocio[indiceCiudad] = "";
      let response = await this._dpaServicio.getDpaCiudades(buscar).toPromise();
      this.ciudades[indiceCiudad] = response.data;
    } catch (e) {
      if (!(e instanceof HttpErrorResponse)) {
        console.log("error Parseado:" + typeof (e) + JSON.stringify(e));
        console.log("error como objeto:" + e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
  }

  async getDpaProvinciasCasa(buscar) {
    try {
      let response = await this._dpaServicio.getDpaProvincias(buscar).toPromise();
      this.provinciasCasa = response.data;
    } catch (e) {
      if (!(e instanceof HttpErrorResponse)) {
        console.log("error Parseado:" + typeof (e) + JSON.stringify(e));
        console.log("error como objeto:" + e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
  }

  async getDpaCiudadesCasa(buscar) {
    try {
      debugger
      this.ciudadCasa = "";
      let response = await this._dpaServicio.getDpaCiudades(buscar).toPromise();
      this.ciudadesCasa[0] = response.data;
    } catch (e) {
      if (!(e instanceof HttpErrorResponse)) {
        console.log("error Parseado:" + typeof (e) + JSON.stringify(e));
        console.log("error como objeto:" + e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
  }

  public mostrarToast(mensaje, icono) {
    this.toastr.warning('<div class="row no-gutters"><p class="col-12 LetrasToastInfo"><strong>Aviso</strong><br>' + mensaje + '</p> </div>', "",
      {positionClass: 'toast-top-right', enableHtml: true, closeButton: true});
  }

  public mostrarToastError(mensaje, icono) {
    this.toastr.error('<div class="row no-gutters"><p align="justify" class="col-12 LetrasToastInfo"><strong>!Error</strong><br>' + mensaje + '</p> </div>', "",
      {positionClass: 'toast-top-right', enableHtml: true, closeButton: true});
  }

  public desdeNegocio() {
    this.banderaValidaciones=false;
    if (this.banderaEspacioFisico == false && this.banderaEdicionDeshabilitadaCasa == false) {
      this.mostrarToast("Asegúrate de guardar los cambios", "")
    } else {
      this.vectorCasa = '';
      this.Sucursales = [];
      if (this.identidadTienda.SUCURSALs[0].TIPO_SUCURSAL == 'Casa') {
        this.Sucursales.push(new Sucursal(null, null, null, null, null, null, null, null, 'Negocio'));
        this.bandAgregarSuc = true;
        this.banderaCasa = false;
        this.banderaEspacioFisico = true;
        this.btnEspacioFisico = true;
        this.btnCasa = false;
      } else {
        this.iniciarEdicion();
      }
    }
  }

  public desdeCasa() {
    this.banderaValidaciones=false;
    if (this.banderaCasa == false && this.banderaEdicionDeshabilitadaNeg == false) {
      this.mostrarToast("Asegúrate de guardar los cambios", "");
    } else {
      this.vectorCasa = '';
      this.Sucursales = [];
      if (this.identidadTienda.SUCURSALs[0].TIPO_SUCURSAL == 'Negocio') {
        this.vectorCasa = new Sucursal(null, null, null, null, null, null, null, null, 'Casa');
        this.bandAgregarSuc = false;
        this.banderaCasa = true;
        this.banderaEspacioFisico = false;
        this.btnEspacioFisico = false;
        this.btnCasa = true;
      } else {
        this.iniciarEdicion();
      }
    }
  }

  public agregarSucursal() {
    this.Sucursales.push(new Sucursal(null, null, null, null, null, null, null, null, "Negocio"));
    // console.log("negocio" + JSON.stringify(this.Sucursales));
  }

  public borrarOpciones(pocicion: number) {
    this.Sucursales.splice(pocicion, 1);
    // console.log("NEGOCIO" + JSON.stringify(this.Sucursales));
  }

  async seleccionarCiudad(event) {
    this.vectorCasa.Ciudad = event;
  }

  async seleccionarCiudadSucursal(event, i) {
    this.Sucursales[i].Ciudad = event;
    // console.log('DPA DPA DPA DPA' + JSON.stringify(this.Sucursales[i].Ciudad));
  }

  public iniciarEdicion() {
    for (let i in this.identidadTienda.SUCURSALs) {
      if (this.identidadTienda.SUCURSALs[i].TIPO_SUCURSAL == 'Casa') {
        this.provinciaCasa = this.identidadTienda.SUCURSALs[i].DPA.DPAP.NOMBRE + ' (Actual)';
        this.ciudadCasa = this.identidadTienda.SUCURSALs[i].DPA.NOMBRE + ' (Actual)';
        this.vectorCasa = new Sucursal(this.identidadTienda.SUCURSALs[i].RUC, this.identidadTienda.SUCURSALs[i].DIRECCION_SUCURSAL, this.identidadTienda.SUCURSALs[i].TELEFONO_SUCURSAL, null, null, this.identidadTienda.SUCURSALs[i].NUM_COD_POSTAL_SUCURSAL, this.identidadTienda.SUCURSALs[i].NUM_REFERENCIA, this.identidadTienda.SUCURSALs[i].DPA.COD_DPA, this.identidadTienda.SUCURSALs[i].TIPO_SUCURSAL);
        // console.log('pase por casa' + JSON.stringify(this.vectorCasa));

        this.bandAgregarSuc = false;
        this.banderaCasa = true;
        this.banderaEspacioFisico = false;
        this.btnEspacioFisico = false;
        this.btnCasa = true;
      } else {
        this.provinciaNegocio[i] = this.identidadTienda.SUCURSALs[i].DPA.DPAP.NOMBRE + ' (Actual)';
        this.ciudadNegocio[i] = this.identidadTienda.SUCURSALs[i].DPA.NOMBRE + ' (Actual)';
        this.Sucursales.push(new Sucursal(this.identidadTienda.SUCURSALs[i].RUC, this.identidadTienda.SUCURSALs[i].DIRECCION_SUCURSAL, this.identidadTienda.SUCURSALs[i].TELEFONO_SUCURSAL, null, null, this.identidadTienda.SUCURSALs[i].NUM_COD_POSTAL_SUCURSAL, this.identidadTienda.SUCURSALs[i].NUM_REFERENCIA, this.identidadTienda.SUCURSALs[i].DPA.COD_DPA, this.identidadTienda.SUCURSALs[i].TIPO_SUCURSAL));
        // console.log('pase por negocio' + JSON.stringify(this.Sucursales));

        this.bandAgregarSuc = true;
        this.banderaCasa = false;
        this.banderaEspacioFisico = true;
        this.btnEspacioFisico = true;
        this.btnCasa = false;
      }
    }
    // console.log(this.Sucursales.length + JSON.stringify(this.Sucursales));
  }

  public habilitarEdicionNeg() {
    this.banderaEdicionDeshabilitadaNeg = false;
  }

  public async guardarSucursalesNeg() {
    try {
      this.banderaValidaciones = true;
      if (document.forms['formSucursales'].checkValidity()) {
        if (this.validarCedula(this.Sucursales) == true) {
          let aprobarCiudades: boolean = true;
          for (let s in this.Sucursales) {
            if (this.ciudadNegocio[s] == "")
              aprobarCiudades = false;
          }

          if (aprobarCiudades) {
            // console.log('hola bebe' + JSON.stringify(this.Sucursales));
            this.loading = true;
            let response = await this._tiendaServicio.actualizarTiendaSucursal(this.Sucursales, this.identidadTienda.NUM_TIENDA).toPromise();
            let data = await this._tiendaServicio.getDatosTienda(this.identidadTienda.NUM_TIENDA).toPromise();

            localStorage.setItem("identityTienda", JSON.stringify(data['data']));
            this.identidadTienda = this._tiendaServicio.getIdentityTienda();
            this.cancelarModificacion();
            this.mensageCorrecto(response['message']);
          } else {
            this.mostrarToastError("Asegúrate de seleccionar la ciudad de tu negocio.", "");
          }
        } else {
          this.mostrarToastError("Al parecer no ingresó un RUC válido", "");
        }
      } else {
        this.mostrarToastError("Al parecer existe errores en el formulario, por favor reviselo nuevamente", "");
      }
    } catch (e) {
      this.loading = false;
      if (!(e instanceof HttpErrorResponse)) {
        console.log("error Parseado:" + typeof (e) + JSON.stringify(e));
        console.log("error como objeto:" + e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
    this.loading = false;
  }

  public cancelarModificacion() {
    /*Variables Input*/
    this.provinciaCasa = "";
    this.ciudadCasa = "";
    this.provinciaNegocio = [];
    this.ciudadNegocio = [];

    /*Vector de Informacion Input*/
    this.vectorCasa = "";
    this.Sucursales = [];

    /*Variables para getProvincia y getCiudad*/
    this.ciudades = [];
    this.ciudadesCasa = [];

    this.banderaEdicionDeshabilitadaNeg = true;
    this.banderaEdicionDeshabilitadaCasa = true;

    this.loading = false;

    /*Banderas de Negocio o Casa */
    this.bandAgregarSuc = false;
    this.banderaCasa = false;
    this.banderaEspacioFisico = false;
    this.btnEspacioFisico = false;
    this.btnCasa = false;

    this.identidadTienda = this._tiendaServicio.getIdentityTienda();
    this.iniciarEdicion();
  }

  public habilitarEdicionCasa() {
    this.banderaEdicionDeshabilitadaCasa = false;
  }

  public async guardarSucursalesCasa() {
    try {
      this.banderaValidaciones = true;
      if (document.forms['formCasa'].checkValidity()) {
        let aprobarCiudades: boolean = true;
        if (this.ciudadCasa == "")
          aprobarCiudades = false;

        if (aprobarCiudades) {
          this.Sucursales[0] = this.vectorCasa;
          if (this.validarCedula(this.Sucursales) == true) {
            //  console.log("CASITAS -------" + JSON.stringify(this.Sucursales));
            this.loading = true;
            let response = await this._tiendaServicio.actualizarTiendaSucursal(this.Sucursales, this.identidadTienda.NUM_TIENDA).toPromise();
            debugger
            //  console.log('CASASASAS CIUDADES ====' + this.ciudadesCasa);

            let data = await this._tiendaServicio.getDatosTienda(this.identidadTienda.NUM_TIENDA).toPromise();

            localStorage.setItem("identityTienda", JSON.stringify(data['data']));
            this.cancelarModificacion();
            this.mensageCorrecto(response['message']);
          } else {
            this.mostrarToastError("Al parecer no ingresó un RUC válido", "");
          }
        } else {
          this.mostrarToastError("Asegúrate de seleccionar la ciudad de tu negocio.", "");
        }
      } else {
        this.mostrarToastError("Al parecer existe errores en el formulario, reviselo nuevamente", "");
      }

    } catch (e) {
      this.loading = false;
      if (!(e instanceof HttpErrorResponse)) {
        console.log("error Parseado:" + typeof (e) + JSON.stringify(e));
        console.log("error como objeto:" + e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
    this.loading = false;
  }

  validarCedula(vectorLocales) {
    var resultado: any = [];
    for (var j = 0; j < vectorLocales.length; j++) {
      var cad: any = vectorLocales[j].Ruc;
      var i;
      var total = 0;
      var longitud = cad.length - 3;
      // console.log("longitus" + longitud);
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
        // console.log(vectorLocales.length + "TOTAL" + vectorLocales[j].Ruc);

        if (cad.charAt(longitud - 1) == total) {
          resultado[j] = true;
          // console.log("TRUE" + resultado[j]);
        } else {
          resultado[j] = false;
          // console.log("FALSE" + resultado[j]);
        }
      }
    }
    for (var j = 0; j < resultado.length; j++) {
      // console.log("RUC" + resultado[j]);
      if (resultado[j] == false)
        return false;
    }
    return true;
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

      customClass: {
        confirmButton: 'btn btn-primary px-5'
        //icon:'sm'
      }
    });
  }

}
