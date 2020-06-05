import {Component,OnDestroy, OnInit } from '@angular/core';
import {Sucursal} from "../../modelos/sucursal";
import {Tienda} from "../../modelos/tienda";
import {DpaServicio} from "../../servicios/dpa.servicio";
import {Imagen_Producto} from "../../modelos/imagen_producto";
import {Horario_Atencion} from "../../modelos/horario_atencion";
import {TiendaServicio} from "../../servicios/tienda.servicio";
import Swal from "sweetalert2";

interface Tienda_Enviar {
  Tienda: Tienda;
  Sucursal: Sucursal;
  Horario_Atencion: Horario_Atencion;
}

declare const require: any;

@Component({
  selector: 'app-registro-tienda',
  templateUrl: './registro-tienda.component.html',
  styleUrls: ['./registro-tienda.component.css']
})

export class RegistroTiendaComponent implements OnInit, OnDestroy{
  public Tienda;
  public Sucursal;
  public Negocios = [];
  public htmlcomponent;
  public Tienda_Enviar: Tienda_Enviar;

  //banderas
  public loading: boolean = false;
  time = {hour: 13, minute: 30};
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
  private soloNumerosPattern: any = "[0-9][0-9]*$[A-Z]{0}";
  private emailPattern: any = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$";
  private urlPattern: any = "(https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})";
  public provincias;
  public ciudades;

  public vectorOpciones: Array<number> = [1]; // las dos formas swon validas pero la activa es ams facil
  /*public vectorOpciones=new Array(0);*/

  /*Banderas de Negocio o Casa*/
  public bandAgregarSuc: boolean = false;
  public banderaCasa: boolean = false;
  public btnEspacioFisico: boolean = false;
  public btnCasa: boolean = false;

  constructor(private _dpaServicio: DpaServicio, private _tiendaServicio: TiendaServicio) {
    this.Tienda = new Tienda(null,null, null, null, null,
      null, null, null, null, null, null);
      this.Negocios.push(new Sucursal(null, null, null, null, null,null,null,null,null));
  }

  async ngOnInit() {
    this.getDpaProvincias("P");
  }

  ngOnDestroy() {
    delete this.Tienda;
    delete this.Sucursal;
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


  public async registrarTienda(){
    try {
      console.log("Objeto a enviar al backend:"+JSON.stringify(this.Tienda));
      let response = await this._tiendaServicio.registrarTienda(this.Tienda_Enviar).toPromise();
      //document.forms["formRegistro"].reset();
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


  public desdeNegocio() {
    this.banderaCasa = false;
    this.bandAgregarSuc=true;
    this.btnEspacioFisico = true;
    this.btnCasa = false;
    this.Negocios[0].Tipo_Sucursal ="Negocio";
    console.log("NEGOCIO"+JSON.stringify(this.Negocios));
  }

  public desdeCasa() {
    this.vectorOpciones=[1];
    this.Negocios=[];
    this.banderaCasa = true;

    this.btnEspacioFisico = false;
    this.btnCasa = true;

    this.Negocios.push(new Sucursal(null, null, null, null, null,null,null,null,"Casa"));

    console.log("CASA"+JSON.stringify(this.Negocios));
  }



  public agregarSucursal() {
    this.vectorOpciones.push(1);
    this.Negocios.push(new Sucursal(null, null, null, null, null,null,null,null,"Negocio"));
    console.log("negocio"+JSON.stringify(this.Negocios));
  }

  public borrarOpciones(pocicion: number) {
    this.vectorOpciones.splice(pocicion,1);
    this.Negocios.splice(pocicion, 1);
    console.log("NEGOCIO"+JSON.stringify(this.Negocios));
  }

  //Logo
  public vectorBanderaAgregarLogo = false;
  public quitarBanderaLogo = false;
  public logoI = [[]];
  public Imagenes_Logo = [[]];

  public async subirImagenes(eventEntrante, indice) {
    if(this.logoI[indice]==null){
      this.logoI[indice]=[];
    }
    if (eventEntrante.target.files && eventEntrante.target.files[0]) {
      var filesAmount = eventEntrante.target.files.length;
      this.vectorBanderaAgregarLogo = true;
      if (filesAmount > 6) {
        //this.banderaMensajeMaximoImagenes = true;
      } else {

        for (let i = 0; i < filesAmount; i++) {
          this.Imagenes_Logo[indice].push(new Imagen_Producto(eventEntrante.target.files[i].name, eventEntrante.target.files[i].type, null, eventEntrante.target.files[i].size));
          var reader = new FileReader();
          reader.onload = (event: any) => {
            if( this.logoI[indice]!=null)
              this.logoI[indice].push(event.target.result);
            document.forms["form"].reset();
          }
          await reader.readAsDataURL(eventEntrante.target.files[i]);
          this.quitarBanderaLogo=true;
        }

        if (this.Imagenes_Logo[indice].length > 6) {
          this.logoI[indice]=null;
          this.Imagenes_Logo[indice].splice(0,  this.Imagenes_Logo[indice].length);
          document.forms["form"].reset();
          this.vectorBanderaAgregarLogo = false;
          //this.banderaMensajeMaximoImagenes = true;
        } else
          if (this.Imagenes_Logo[indice].length == 6) {
          //this.banderaMensajeMaximoImagenes = false
          //this.banderaMaximoImagenes = false;
          }

      }
    }
  }

  public quitarImagenes(indice: any, imagen) {
    this.logoI[indice].splice(imagen, 1);
    document.forms["form"].reset();
    this.Imagenes_Logo[indice].splice(imagen, 1);
    this.quitarBanderaLogo=false;
  }

  //Banner
  public vectorBanderaAgregarBanner = false;
  public quitarBanderaBanner = false;
  public banner = [[]];
  public Banner_Producto = [[]];

  public async subirBanner(eventEntrante, indice) {
    if(this.banner[indice]==null){
      this.banner[indice]=[];
    }
    if (eventEntrante.target.files && eventEntrante.target.files[0]) {
      var filesAmount = eventEntrante.target.files.length;
      this.vectorBanderaAgregarBanner = true;
      if (filesAmount > 6) {
        //this.banderaMensajeMaximoImagenes = true;
      } else {

        for (let i = 0; i < filesAmount; i++) {
          this.Banner_Producto[indice].push(new Imagen_Producto(eventEntrante.target.files[i].name, eventEntrante.target.files[i].type, null, eventEntrante.target.files[i].size));

          var reader = new FileReader();
          reader.onload = (event: any) => {
            if( this.banner[indice]!=null)
              this.banner[indice].push(event.target.result);
            document.forms["form"].reset();
          }
          await reader.readAsDataURL(eventEntrante.target.files[i]);
          this.quitarBanderaBanner=true;
        }

        if (this.Banner_Producto[indice].length > 6) {
          this.banner[indice]=null;
          this.Banner_Producto[indice].splice(0,  this.Banner_Producto[indice].length);
          document.forms["form"].reset();
          this.vectorBanderaAgregarBanner = false;
          //this.banderaMensajeMaximoImagenes = true;
        } else
        if (this.Banner_Producto[indice].length == 6) {
          //this.banderaMensajeMaximoImagenes = false
          //this.banderaMaximoImagenes = false;
        }

      }
    }
  }

  public quitarBanner(indice: any, banner) {
    this.banner[indice].splice(banner, 1);
    document.forms["form"].reset();
    this.Banner_Producto[indice].splice(banner, 1);
    this.quitarBanderaBanner=false;
  }
}
