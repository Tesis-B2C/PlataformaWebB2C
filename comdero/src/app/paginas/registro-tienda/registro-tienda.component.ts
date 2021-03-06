import {Component, DoCheck, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Sucursal} from "../../modelos/sucursal";
import {Tienda} from "../../modelos/tienda";
import {DpaServicio} from "../../servicios/dpa.servicio";
import {TiendaServicio} from "../../servicios/tienda.servicio";
import {ToastrService} from 'ngx-toastr';
import Swal from "sweetalert2";
import {WizardComponent} from "angular-archwizard";
import {AgenteServicio} from "../../servicios/agente.servicio";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-registro-tienda',
  templateUrl: './registro-tienda.component.html',
  styleUrls: ['./registro-tienda.component.css']
})

export class RegistroTiendaComponent implements OnInit, OnDestroy, DoCheck {


  public Tienda;
  public Sucursales = [];
  public htmlcomponent;
  public Tienda_Enviar = {
    Tienda: Tienda,
    Sucursal: []
  }

  public editorConfig = {
    "editable": true,
    "spellcheck": true,
    "height": "100px",
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

  public LetrasNumerosPattern: any = "[ .aA-zZ 0-9 ][ .aA-zZ 0-9 ]*$";
  public soloNumerosPattern: any = "[0-9][0-9]*$[A-Z]{0}";
  public emailPattern: any = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$";
  public urlPattern: any = "(https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})";
  public provincias;
  public ciudades = [];

  public vectorOpciones: Array<number> = [1]; // las dos formas swon validas pero la activa es ams facil
  /*public vectorOpciones=new Array(0);*/

  //banderas
  public loading: boolean = false;
  public banderaToast: boolean = false;
  public banderaToastRuc: boolean = false;

  // mensajes
  public mensaje;
  public titulo;

  @ViewChild(WizardComponent, null) wizard: WizardComponent;



  constructor(public toastr: ToastrService, public _agenteServicio: AgenteServicio, public _dpaServicio: DpaServicio, public _tiendaServicio: TiendaServicio) {
    let identidad = this._agenteServicio.getIdentity();
    this.Tienda = new Tienda(identidad.COD_AGENTE, null, null, null, null,
      null, null, null, null, 0, null, 'No disponible', null);
    this.Sucursales.push(new Sucursal(null, null, null, null, null, null, null, null, 'Negocio'));
  }

  async ngOnInit() {
    this.getDpaProvincias("P");
    this.mensaje = "Espere por favor, estamos preparando todo para brindarte la mejor experiencia en ventas, en un momento terminamos";
    this.titulo = "INICIANDO PROCESO";
  }

  ngOnDestroy() {
    delete this.Tienda;
    delete this.Sucursales;
    delete this.Tienda_Enviar;
  }

  ngDoCheck(): void {
    //this.panelDos.style.maxHeight = this.panelUno.offsetHeight + 'px';
  }

  atras() {
    this.wizard.goToPreviousStep();
  }

  async getDpaProvincias(buscar) {
    try {
      let response = await this._dpaServicio.getDpaProvincias(buscar).toPromise();
      // console.log("RESPONSE provincia" + response.data);
      this.provincias = response.data;
    } catch (e) {
      if (!(e instanceof HttpErrorResponse)){
        console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
        console.log("error como objeto:"+ e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
  }

  async getDpaCiudades(buscar, indiceCiudad) {
    try {
      let response = await this._dpaServicio.getDpaCiudades(buscar).toPromise();
      // console.log("RESPONSE" + response.data);
      this.ciudades[indiceCiudad] = response.data;
    } catch (e) {
      if (!(e instanceof HttpErrorResponse)){
        console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
        console.log("error como objeto:"+ e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
  }

  validarCedula() {
    var resultado: any = [];
    for (var j = 0; j < this.Sucursales.length; j++) {
      var cad: any = this.Sucursales[j].Ruc;
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
        // console.log(this.Sucursales.length + "TOTAL" + this.Sucursales[j].Ruc);

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

  public async ValidarPaso1(validador) {
    if (validador == "1") {
      this.banderaToast = false;
      // console.log("PASO1" + JSON.stringify(this.Tienda));
    } else {
      this.banderaToast = true;
    }
    this.mensajeToast(1);
  }

  public async ValidarPaso2(validador) {
    if (validador == "2") {
      this.banderaToast = false;
      let vacioCiudad: boolean = false;
      for (let i in this.Sucursales) {
        // console.log("SUCURSAL CIUDAD" + this.Sucursales[i].Ciudad);
        if (this.Sucursales[i].Ciudad == "" || this.Sucursales[i].Ciudad == null)
          vacioCiudad = true;
      }
      // console.log("vacioCiudad" + vacioCiudad);
      if (!vacioCiudad) {
        if (this.validarCedula() == true) {
          this.banderaToastRuc = false;
          this.wizard.goToNextStep();
        } else
          this.banderaToastRuc = true;
      } else {
        this.mostrarToast("Asegúrate de ingresar la provincia y ciudad", "");
      }
    } else {
      this.banderaToast = true;
    }
    // console.log("NEGOCIO" + JSON.stringify(this.Sucursales));
    this.mensajeToast(2);
  }

  public async FinalPaso3(estado) {
    if (estado == 'Omitir') {
      this.Tienda.Logo = null;
      this.Tienda.Banner = null;
      this.loading = true;
      this.registrarTienda();
    } else {
      this.loading = true;
      this.registrarTienda();
    }

  }

  public mensajeToast(paso) {
    if (this.banderaToast && !document.forms["formPaso" + paso].checkValidity()) {
      this.mostrarToast("Asegúrate de llenar todos los campos obligatorios marcados con *", "");
    }

    if (this.banderaToastRuc) {
      this.mostrarToast("Al parecer no ingreso un RUC válido", "");
    }
  }

  public mostrarToast(mensaje, icono) {
    this.toastr.error('<div class="row no-gutters"><p align="justify" class="col-12 LetrasToastInfo"><strong>!Error</strong><br>' + mensaje + '</p> </div>', "",
      {positionClass: 'toast-top-right', enableHtml: true, closeButton: true});
  }

  public tiendaRegistrada;

  public async registrarTienda() {
    this.loading = true;
    try {
      this.Tienda_Enviar.Tienda = this.Tienda;
      this.Tienda_Enviar.Sucursal = this.Sucursales;
      // console.log("Objeto a enviar al backend:" + this.Tienda_Enviar);
      this.tiendaRegistrada = await this._tiendaServicio.registrarTienda(this.Tienda_Enviar, this.filesToUpload, this.filesToUpload2).toPromise();
      // let responseLogo = await this.subirImagenesServidor(this.filesToUpload, tienda['NUM_TIENDA'], "Logo");
      // let responseBanner = await this.subirImagenesServidor(this.filesToUpload2, tienda['NUM_TIENDA'], "Banner");
      debugger
      window.scroll(0, 0);
      if (this.tiendaRegistrada) {
        debugger;
        this.titulo = "LISTO!";
        this.mensaje = this.tiendaRegistrada['message'];
      }

    } catch (e) {
      this.loading = false;
      if (!(e instanceof HttpErrorResponse)){
        console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
        console.log("error como objeto:"+ e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
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
    // console.log("NEGOCIO" + JSON.stringify(this.Sucursales));
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
    // console.log("CASA" + JSON.stringify(this.Sucursales));
  }


  public agregarSucursal() {
    this.vectorOpciones.push(1);
    this.Sucursales.push(new Sucursal(null, null, null, null, null, null, null, null, "Negocio"));
    // console.log("negocio" + JSON.stringify(this.Sucursales));
  }

  public borrarOpciones(pocicion: number) {
    this.vectorOpciones.splice(pocicion, 1);
    this.Sucursales.splice(pocicion, 1);
    // console.log("NEGOCIO" + JSON.stringify(this.Sucursales));
  }

  //Logo
  public filesToUpload: File;
  public urlLogo;

  public async subirLogo(event: any) {

    if (event.target.files && event.target.files[0]) {
      this.filesToUpload = <File>event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.urlLogo = event.target.result;
      }
      reader.readAsDataURL(this.filesToUpload);
    }
  }

  public quitarLogo() {
    this.urlLogo = "";
    this.Tienda.Logo = "";

  }

  //Banner
  public filesToUpload2: File;
  public urlBanner;

  public async subirBanner(event: any) {

    if (event.target.files && event.target.files[0]) {
      this.filesToUpload2 = <File>event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.urlBanner = event.target.result;
      }
      reader.readAsDataURL(this.filesToUpload2);
    }
  }

  public quitarBanner() {
    this.urlBanner = "";
    this.Tienda.Banner = "";
  }

  /*async subirImagenesServidor(imagenPorSubir, Id_Tienda, tipo) {
    debugger;
    try {
      let formData = new FormData();
      for (let i = 0; i < imagenPorSubir.length; i++) {
        formData.append("uploads[]", imagenPorSubir[i], imagenPorSubir[i].name)
      }
      let response = await this._tiendaServicio.subirImagenesServidor(formData, Id_Tienda, tipo).toPromise();
      this.titulo = "PERSONALIZACIÓN    (" + tipo + ")";
      this.mensaje = response['message'];
      console.log(response['message']);
      return true
    } catch (e) {
      this.titulo = "PERSONALIZACIÓN    (" + tipo + ")";
      this.mensaje = "Al parecer existe un error con la personalización de tu tienda (Logo y Banner) intenta hacerlo mas tarde";
      return false

    }
  }*/

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
      html: mensaje,
      position: 'center',
      width: 600,
      buttonsStyling: false,

      customClass: {
        confirmButton: 'btn btn-primary px-5',
        //icon:'sm'
      }
    });
  }

  public minusCorreo() {
    if (this.Tienda.Correo_Tienda != '' || this.Tienda.Correo_Tienda != null)
      this.Tienda.Correo_Tienda = this.Tienda.Correo_Tienda.toLowerCase();
  }

  public minusPagina() {
    if (this.Tienda.Link_Pagina != '' || this.Tienda.Link_Pagina != null)
      this.Tienda.Link_Pagina = this.Tienda.Link_Pagina.toLowerCase();
  }

  public minusFacebook() {
    if (this.Tienda.Link_Facebook != '' || this.Tienda.Link_Facebook != null)
      this.Tienda.Link_Facebook = this.Tienda.Link_Facebook.toLowerCase();
  }

}
