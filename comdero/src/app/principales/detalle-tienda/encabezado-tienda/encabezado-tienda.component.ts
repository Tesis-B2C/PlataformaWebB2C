import {Component, OnInit} from '@angular/core';
import {TiendaServicio} from "../../../servicios/tienda.servicio";
import {ActivatedRoute, Router} from "@angular/router";
import Swal from "sweetalert2";

import {GLOBAL} from "../../../servicios/global";
import {HttpErrorResponse} from "@angular/common/http";
@Component({
  selector: 'app-encabezado-tienda',
  templateUrl: './encabezado-tienda.component.html',
  styleUrls: ['./encabezado-tienda.component.css']
})
export class EncabezadoTiendaComponent implements OnInit {
  public idTienda;
  public Tienda: any;
  public Logo = "";
  public Banner = "";
  public vPaginasWeb = [];
  public contactoWhatsapp;

  constructor(public _tiendaServicio: TiendaServicio, public route: ActivatedRoute, public router: Router) {

  }

  async ngOnInit() {
    await this.getDetalleTiendaProducto();
     await this.getLogo();
    await this.getBanner();
    await this.getSitiosWeb();
    await this.getCategorias();
    await this.getDisponibilidad();
    this.getContacto();
    this.updateVisitas();
    // this.router.navigate(['/principales/menu/detalle-tienda/118/tienda',this.Tienda.NUM_TIENDA])

  }


  public async updateVisitas() {
    try {
      let count = this.Tienda.VISITAS + 1;
      debugger
     let response = await this._tiendaServicio.updateVisitas(count, this.idTienda).toPromise();
    } catch (e) {
      console.log("error como objeto 2:"+ e);
      if (!(e instanceof HttpErrorResponse)){
        console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
        console.log("error como objeto:"+ e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
  }

  public getContacto() {
    debugger;
    let contacto = this.Tienda.CONTACTO_WHATSAPP.slice(1, 10);
    this.contactoWhatsapp = '593' + contacto;

  }

  async getDetalleTiendaProducto() {
    try {
      this.idTienda = this.route.snapshot.params.id;
      let response = await this._tiendaServicio.getDetalleTiendaProducto(this.idTienda).toPromise();
      this.Tienda = response.data;
      // console.log("tienda buscada", JSON.stringify(this.Tienda));
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

  getLogo() {
    this.Logo = 'assets/images/no-image.png';
    let pathImagen = this.Tienda.LOGO;

    if (pathImagen) {
      this.Logo = GLOBAL.urlImagen + pathImagen;
      // console.log("direccion", this.Logo)
    }
    return this.Logo;
  }

  getBanner() {
    this.Banner = 'assets/images/no-imagen8.png';
    let pathImagen = this.Tienda.BANNER;
    if (pathImagen) {
      this.Banner = GLOBAL.urlImagen + pathImagen;
      // console.log("direccion", this.Banner)
    }
    return this.Banner;
  }

  obj = {
    tipo: null,
    direccion: null
  }

  getSitiosWeb() {
    this.obj = {
      tipo: null,
      direccion: null
    };
    if (this.Tienda.LINK_FACEBOOK) {
      this.obj.tipo = "facebook";
      this.obj.direccion = this.Tienda.LINK_FACEBOOK;
      this.vPaginasWeb.push(this.obj);
    }
    this.obj = {
      tipo: null,
      direccion: null
    };
    if (this.Tienda.LINK_PAGINA) {
      this.obj.tipo = "pagina";
      this.obj.direccion = this.Tienda.LINK_PAGINA;
      this.vPaginasWeb.push(this.obj);
    }
  }

  categorias = new Set();

  getCategorias() {
    this.categorias = new Set();
    for (let c of this.Tienda.OFERTA) {
      this.categorias.add(c.PRODUCTO.PRODUCTO_CATEGORIA[0].CATEGORIum.NOMBRE);

    }
    // console.log("categorias", this.categorias);

  }

  public Disponibilidad;
  public JornadaActual;

  public vJornadas = []
  public jornadas = {
    dia: null,
    jornada: null
  };

  getDisponibilidad() {
    this.Disponibilidad = "Cerrado";
    debugger;
    this.Disponibilidad;
    this.JornadaActual;
    let data = new Date();
    var diasSemana = new Array("Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado");
    let hoy = diasSemana[data.getDay()];
    if (this.Tienda.HORARIO_ATENCION == 'Concreto') {
      for (let d of this.Tienda.HORARIO_ATENCIONs) {
        this.jornadas = {
          dia: null,
          jornada: null
        };
        if (d.INICIO_JORNADA2) {
          let Jornada = this.transformarHora(d.INICIO_JORNADA1) + "-" + this.transformarHora(d.FIN_JORNADA1) + "  -   " + this.transformarHora(d.INICIO_JORNADA2) + "-" + this.transformarHora(d.FIN_JORNADA2);
          this.jornadas.dia = d.DIA;
          this.jornadas.jornada = Jornada;
          this.vJornadas.push(this.jornadas);
        } else {
          let Jornada = this.transformarHora(d.INICIO_JORNADA1) + "-" + this.transformarHora(d.FIN_JORNADA1);
          this.jornadas.dia = d.DIA;
          this.jornadas.jornada = Jornada;
          this.vJornadas.push(this.jornadas);
        }

        if (hoy == d.DIA) {
          let horaActual = data.getHours() + ':' + data.getMinutes() + ':' + data.getSeconds();
          if ((this.obtenerMinutos(horaActual) > this.obtenerMinutos(d.INICIO_JORNADA1) && this.obtenerMinutos(horaActual) < this.obtenerMinutos(d.FIN_JORNADA1)) || (this.obtenerMinutos(horaActual) > this.obtenerMinutos(d.INICIO_JORNADA2) && this.obtenerMinutos(horaActual) < this.obtenerMinutos(d.FIN_JORNADA2))) {
            this.Disponibilidad = "Disponible";
            if (d.INICIO_JORNADA2) {
              this.JornadaActual = this.transformarHora(d.INICIO_JORNADA1) + "-" + this.transformarHora(d.FIN_JORNADA1) + "  -   " + this.transformarHora(d.INICIO_JORNADA2) + "-" + this.transformarHora(d.FIN_JORNADA2);
            } else {
              this.JornadaActual = this.transformarHora(d.INICIO_JORNADA1) + "-" + this.transformarHora(d.FIN_JORNADA1);
            }
          } else {

            if (d.INICIO_JORNADA2) {
              this.JornadaActual = this.transformarHora(d.INICIO_JORNADA1) + "-" + this.transformarHora(d.FIN_JORNADA1) + " - " + this.transformarHora(d.INICIO_JORNADA2) + "-" + this.transformarHora(d.FIN_JORNADA2);
            } else {
              this.JornadaActual = this.transformarHora(d.INICIO_JORNADA1) + "-" + this.transformarHora(d.FIN_JORNADA1);
            }
          }
        }
      }
    } else if (this.Tienda.HORARIO_ATENCION == 'No disponible') {

      this.Disponibilidad = "No disponible";
    } else if (this.Tienda.HORARIO_ATENCION == 'Siempre') {
      this.Disponibilidad = "Siempre abierto";
    }
  }


  transformarHora(hora) {
    if (hora) {
      let response = hora.split(":");
      return response[0] + ":" + response[1];
    }
  }

  obtenerMinutos(hora) {
    if (hora) {
      var spl = hora.split(":");
      return parseInt(spl[0]) * 60 + parseInt(spl[1]);
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
        container: 'my-swal'
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
