import {Component, OnDestroy, OnInit} from '@angular/core';
import {Tienda} from "../../../modelos/tienda";
import {Horario_Atencion} from "../../../modelos/horario_atencion";
import {TiendaServicio} from "../../../servicios/tienda.servicio";
import Swal from "sweetalert2";
import {ToastrService} from "ngx-toastr";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-general-tienda',
  templateUrl: './general-tienda.component.html',
  styleUrls: ['./general-tienda.component.css']
})

export class GeneralTiendaComponent implements OnInit, OnDestroy {
  public EditarTienda;
  public Editar_Dia_Atencion = [];
  public Tienda_Editar_Enviar = {
    EditarTienda: Tienda,
    Editar_Dias_Atencion: []
  }

  public editorConfig = {
    "editable": false,
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

  public LetrasNumerosPattern: any = "[ .aA-zZ 0-9 ][ .aA-zZ 0-9 ]*$";
  public emailPattern: any = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$";
  public urlPattern: any = "(https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})";
  public soloNumerosPattern: any = "[0-9][0-9]*$[A-Z]{0}";
  public banderaEdicionDeshabilitada: boolean = true;

  public identidadTienda;
  public loading: boolean = false;

  public checkConcreto: boolean = false;
  public checkSiempre: boolean = false;
  public checkNoDisponible: boolean = false;

  public banderaValidaciones: boolean = false;

  constructor(public toastr: ToastrService, public _tiendaServicio: TiendaServicio) {
    this.EditarTienda = new Tienda(null, null, null, null, null,
      null, null, null, null, null, null, null, null);
  }


  ngOnInit() {
    this.identidadTienda = this._tiendaServicio.getIdentityTienda();
    for (let i = 0; i < 7; i++)
      this.Editar_Dia_Atencion.push(new Horario_Atencion(null, null, null, null, null));
    this.iniciarEdicion();
  }

  ngOnDestroy() {
    delete this.Editar_Dia_Atencion;
    delete this.EditarTienda;
    delete this.Tienda_Editar_Enviar;
    this.toastr.clear();
  }

  /*-----------HORARIO ATENCION--------------*/
  public banderaHoraConcreta: boolean = false;

  public banderaDisableLunes: boolean = true;
  public banderaDisableMartes: boolean = true;
  public banderaDisableMiercoles: boolean = true;
  public banderaDisableJueves: boolean = true;
  public banderaDisableViernes: boolean = true;
  public banderaDisableSabado: boolean = true;
  public banderaDisableDomingo: boolean = true;

  public banderaCheckLunes: boolean = false;
  public banderaCheckMartes: boolean = false;
  public banderaCheckMiercoles: boolean = false;
  public banderaCheckJueves: boolean = false;
  public banderaCheckViernes: boolean = false;
  public banderaCheckSabado: boolean = false;
  public banderaCheckDomingo: boolean = false;

  public banderaActivaLunesJ2: boolean = false;
  public banderaActivaMartesJ2: boolean = false;
  public banderaActivaMiercolesJ2: boolean = false;
  public banderaActivaJuevesJ2: boolean = false;
  public banderaActivaViernesJ2: boolean = false;
  public banderaActivaSabadoJ2: boolean = false;
  public banderaActivaDomingoJ2: boolean = false;

  public btnMasLunes: boolean = false;
  public btnMasMartes: boolean = false;
  public btnMasMiercoles: boolean = false;
  public btnMasJueves: boolean = false;
  public btnMasViernes: boolean = false;
  public btnMasSabado: boolean = false;
  public btnMasDomingo: boolean = false;

  public banderaDisableLunesJ2: boolean = false;
  public banderaDisableMartesJ2: boolean = false;
  public banderaDisableMiercolesJ2: boolean = false;
  public banderaDisableJuevesJ2: boolean = false;
  public banderaDisableViernesJ2: boolean = false;
  public banderaDisableSabadoJ2: boolean = false;
  public banderaDisableDomingoJ2: boolean = false;

  public horarioRadio(Tipo) {
    if (Tipo == "Concreto") {         /*Tipo Horas Concretas*/
      this.banderaHoraConcreta = true;
    } else {
      this.banderaHoraConcreta = false;
    }
    this.EditarTienda.Horario_Atencion = Tipo;
  }

  public horarioCheckLunes(event) {
    if (event.target.checked) {
      this.banderaCheckLunes = true;
      this.banderaDisableLunes = false;
      this.btnMasLunes = true;
      this.Editar_Dia_Atencion[0].Dia = 'Lunes';
      // console.log("Ya me llene el LUNES DIA" + JSON.stringify(this.Editar_Dia_Atencion));
    } else {
      this.banderaCheckLunes = false;
      this.banderaDisableLunes = true;
      this.btnMasLunes = false;
      this.banderaActivaLunesJ2 = false;
      this.Editar_Dia_Atencion[0].Dia = null;
      // console.log("Ya me llene el LUNES DIA ME BORRE" + JSON.stringify(this.Editar_Dia_Atencion));
    }
  }

  public horarioCheckMartes(event) {
    if (event.target.checked) {
      this.banderaCheckMartes = true;
      this.banderaDisableMartes = false;
      this.btnMasMartes = true;
      this.Editar_Dia_Atencion[1].Dia = 'Martes';
    } else {
      this.banderaCheckMartes = false;
      this.banderaDisableMartes = true;
      this.btnMasMartes = false;
      this.banderaActivaMartesJ2 = false;
      this.Editar_Dia_Atencion[1].Dia = null;
    }
  }

  public horarioCheckMiercoles(event) {
    if (event.target.checked) {
      this.banderaCheckMiercoles = true;
      this.banderaDisableMiercoles = false;
      this.btnMasMiercoles = true;
      this.Editar_Dia_Atencion[2].Dia = 'Miercoles';
    } else {
      this.banderaCheckMiercoles = false;
      this.banderaDisableMiercoles = true;
      this.btnMasMiercoles = false;
      this.banderaActivaMiercolesJ2 = false;
      this.Editar_Dia_Atencion[2].Dia = null;
    }
  }

  public horarioCheckJueves(event) {
    if (event.target.checked) {
      this.banderaCheckJueves = true;
      this.banderaDisableJueves = false;
      this.btnMasJueves = true;
      this.Editar_Dia_Atencion[3].Dia = 'Jueves';
    } else {
      this.banderaCheckJueves = false;
      this.banderaDisableJueves = true;
      this.btnMasJueves = false;
      this.banderaActivaJuevesJ2 = false;
      this.Editar_Dia_Atencion[3].Dia = null;
    }
  }

  public horarioCheckViernes(event) {
    if (event.target.checked) {
      this.banderaCheckViernes = true;
      this.banderaDisableViernes = false;
      this.btnMasViernes = true;
      this.Editar_Dia_Atencion[4].Dia = 'Viernes';
    } else {
      this.banderaCheckViernes = false;
      this.banderaDisableViernes = true;
      this.btnMasViernes = false;
      this.banderaActivaViernesJ2 = false;
      this.Editar_Dia_Atencion[4].Dia = null;
    }
  }

  public horarioCheckSabado(event) {
    if (event.target.checked) {
      this.banderaCheckSabado = true;
      this.banderaDisableSabado = false;
      this.btnMasSabado = true;
      this.Editar_Dia_Atencion[5].Dia = 'Sabado';
    } else {
      this.banderaCheckSabado = false;
      this.banderaDisableSabado = true;
      this.btnMasSabado = false;
      this.banderaActivaSabadoJ2 = false;
      this.Editar_Dia_Atencion[5].Dia = null;
    }
  }

  public horarioCheckDomingo(event) {
    if (event.target.checked) {
      this.banderaCheckDomingo = true;
      this.banderaDisableDomingo = false;
      this.btnMasDomingo = true;
      this.Editar_Dia_Atencion[6].Dia = 'Domingo';
    } else {
      this.banderaCheckDomingo = false;
      this.banderaDisableDomingo = true;
      this.btnMasDomingo = false;
      this.banderaActivaDomingoJ2 = false;
      this.Editar_Dia_Atencion[6].Dia = null;
    }
  }

  public activarJ2(dia) {
    if (dia == 0) {
      this.banderaActivaLunesJ2 = true;
      this.btnMasLunes = false;
    }

    if (dia == 1) {
      this.banderaActivaMartesJ2 = true;
      this.btnMasMartes = false;
    }

    if (dia == 2) {
      this.banderaActivaMiercolesJ2 = true;
      this.btnMasMiercoles = false;
    }

    if (dia == 3) {
      this.banderaActivaJuevesJ2 = true;
      this.btnMasJueves = false;
    }

    if (dia == 4) {
      this.banderaActivaViernesJ2 = true;
      this.btnMasViernes = false;
    }

    if (dia == 5) {
      this.banderaActivaSabadoJ2 = true;
      this.btnMasSabado = false;
    }

    if (dia == 6) {
      this.banderaActivaDomingoJ2 = true;
      this.btnMasDomingo = false;
    }
  }

  public cerrarJ2(dia) {
    if (dia == 0) {
      this.banderaActivaLunesJ2 = false;
      this.btnMasLunes = true;
    }

    if (dia == 1) {
      this.banderaActivaMartesJ2 = false;
      this.btnMasMartes = true;
    }

    if (dia == 2) {
      this.banderaActivaMiercolesJ2 = false;
      this.btnMasMiercoles = true;
    }

    if (dia == 3) {
      this.banderaActivaJuevesJ2 = false;
      this.btnMasJueves = true;
    }

    if (dia == 4) {
      this.banderaActivaViernesJ2 = false;
      this.btnMasViernes = true;
    }

    if (dia == 5) {
      this.banderaActivaSabadoJ2 = false;
      this.btnMasSabado = true;
    }

    if (dia == 6) {
      this.banderaActivaDomingoJ2 = false;
      this.btnMasDomingo = true;
    }

    this.Editar_Dia_Atencion[dia].Inicio_Jornada2 = null;
    this.Editar_Dia_Atencion[dia].Fin_Jornada2 = null;

  }

  public horario;        //Radio Button de horarios

  /*-----------FIN HORARIO ATENCION--------------*/
  public cancelarModificacion() {
    this.banderaValidaciones=false;
    // console.log('estoy pasando por cancelar');
    this.horario = null;
    this.banderaEdicionDeshabilitada = true;

    this.checkNoDisponible = false;
    this.checkConcreto = false;
    this.checkSiempre = false;

    this.banderaDisableLunes = true;
    this.banderaDisableMartes = true;
    this.banderaDisableMiercoles = true;
    this.banderaDisableJueves = true;
    this.banderaDisableViernes = true;
    this.banderaDisableSabado = true;
    this.banderaDisableDomingo = true;

    this.banderaCheckLunes = false;
    this.banderaCheckMartes = false;
    this.banderaCheckMiercoles = false;
    this.banderaCheckJueves = false;
    this.banderaCheckViernes = false;
    this.banderaCheckSabado = false;
    this.banderaCheckDomingo = false;

    this.banderaActivaLunesJ2 = false;
    this.banderaActivaMartesJ2 = false;
    this.banderaActivaMiercolesJ2 = false;
    this.banderaActivaJuevesJ2 = false;
    this.banderaActivaViernesJ2 = false;
    this.banderaActivaSabadoJ2 = false;
    this.banderaActivaDomingoJ2 = false;

    this.btnMasLunes = false;
    this.btnMasMartes = false;
    this.btnMasMiercoles = false;
    this.btnMasJueves = false;
    this.btnMasViernes = false;
    this.btnMasSabado = false;
    this.btnMasDomingo = false;

    this.banderaDisableLunesJ2 = false;
    this.banderaDisableMartesJ2 = false;
    this.banderaDisableMiercolesJ2 = false;
    this.banderaDisableJuevesJ2 = false;
    this.banderaDisableViernesJ2 = false;
    this.banderaDisableSabadoJ2 = false;
    this.banderaDisableDomingoJ2 = false;

    this.identidadTienda = this._tiendaServicio.getIdentityTienda();
    this.Editar_Dia_Atencion = [];
    for (let i = 0; i < 7; i++)
      this.Editar_Dia_Atencion.push(new Horario_Atencion(null, null, null, null, null));
    // console.log('CAMCELAR' + JSON.stringify(this.Editar_Dia_Atencion));
    this.iniciarEdicion();
  }

  public habilitarEdicion() {
    this.banderaEdicionDeshabilitada = false;
    this.editorConfig.editable = true;

    if (this.identidadTienda.HORARIO_ATENCION == 'Concreto') {
      for (let horario_atencion of this.identidadTienda.HORARIO_ATENCIONs) {
        if (horario_atencion.DIA == 'Lunes') {
          this.banderaDisableLunes = false;
          if (this.Editar_Dia_Atencion[0].Inicio_Jornada2 != null) {
            this.banderaDisableLunesJ2 = false;
          }
        }

        if (horario_atencion.DIA == 'Martes') {
          this.banderaDisableMartes = false;
          if (this.Editar_Dia_Atencion[1].Inicio_Jornada2 != null) {
            this.banderaDisableMartesJ2 = false;
          }
        }

        if (horario_atencion.DIA == 'Miercoles') {
          this.banderaDisableMiercoles = false;
          if (this.Editar_Dia_Atencion[2].Inicio_Jornada2 != null) {
            this.banderaDisableMiercolesJ2 = false;
          }
        }

        if (horario_atencion.DIA == 'Jueves') {
          this.banderaDisableJueves = false;
          if (this.Editar_Dia_Atencion[3].Inicio_Jornada2 != null) {
            this.banderaDisableJuevesJ2 = false;
          }
        }

        if (horario_atencion.DIA == 'Viernes') {
          this.banderaDisableViernes = false;
          if (this.Editar_Dia_Atencion[4].Inicio_Jornada2 != null) {
            this.banderaDisableViernesJ2 = false;
          }
        }

        if (horario_atencion.DIA == 'Sabado') {
          this.banderaDisableSabado = false;
          if (this.Editar_Dia_Atencion[5].Inicio_Jornada2 != null) {
            this.banderaDisableSabadoJ2 = false;
          }
        }

        if (horario_atencion.DIA == 'Domingo') {
          this.banderaDisableDomingo = false;
          if (this.Editar_Dia_Atencion[6].Inicio_Jornada2 != null) {
            this.banderaDisableDomingoJ2 = false;
          }
        }
      }
    }
  }

  public iniciarEdicion() {
    // console.log('TERMINOS'+this.identidadTienda.TERMINOS_CONDICIONES);
    this.EditarTienda.Razon_Social = this.identidadTienda.RAZON_SOCIAL;
    this.EditarTienda.Nombre_Comercial = this.identidadTienda.NOMBRE_COMERCIAL;
    this.EditarTienda.Descripcion_Tienda = this.identidadTienda.DESCRIPCION_TIENDA;
    this.EditarTienda.Correo_Tienda = this.identidadTienda.CORREO_TIENDA;
    this.EditarTienda.Link_Pagina = this.identidadTienda.LINK_PAGINA;
    this.EditarTienda.Link_Facebook = this.identidadTienda.LINK_FACEBOOK;
    this.EditarTienda.Terminos_Condiciones = this.identidadTienda.TERMINOS_CONDICIONES;
    this.EditarTienda.Horario_Atencion = this.identidadTienda.HORARIO_ATENCION;
    this.EditarTienda.Contacto_WhatsApp = this.identidadTienda.CONTACTO_WHATSAPP;
    if (this.identidadTienda.HORARIO_ATENCION == 'No disponible') {
      this.banderaHoraConcreta = false;
      this.checkNoDisponible = true;
      this.checkConcreto = false;
      this.checkSiempre = false;
    }
    if (this.identidadTienda.HORARIO_ATENCION == 'Siempre') {
      this.banderaHoraConcreta = false;
      this.checkNoDisponible = false;
      this.checkConcreto = false;
      this.checkSiempre = true;
    }

    if (this.identidadTienda.HORARIO_ATENCION == 'Concreto') {
      this.banderaHoraConcreta = true;
      this.checkNoDisponible = false;
      this.checkConcreto = true;
      this.checkSiempre = false;
      this.banderaHoraConcreta = true;
      this.verConcretoBase();
    }
    // console.log("SOY LA TIENDA" + this.identidadTienda.HORARIO_ATENCION);
    this.banderaEdicionDeshabilitada = true;
    this.editorConfig.editable = false;
  }

  public verConcretoBase() {
    for (let horario_atencion of this.identidadTienda.HORARIO_ATENCIONs) {
      if (horario_atencion.DIA == 'Lunes') {
        this.btnMasLunes = true;
        this.banderaCheckLunes = true;
        this.banderaDisableLunes = true;
        this.Editar_Dia_Atencion[0].Dia = horario_atencion.DIA;
        this.Editar_Dia_Atencion[0].Inicio_Jornada1 = horario_atencion.INICIO_JORNADA1;
        this.Editar_Dia_Atencion[0].Fin_Jornada1 = horario_atencion.FIN_JORNADA1;
        this.Editar_Dia_Atencion[0].Inicio_Jornada2 = horario_atencion.INICIO_JORNADA2;
        this.Editar_Dia_Atencion[0].Fin_Jornada2 = horario_atencion.FIN_JORNADA2;
        if (this.Editar_Dia_Atencion[0].Inicio_Jornada2 != null) {
          this.activarJ2(0);
          this.banderaDisableLunesJ2 = true;
        }
      }

      if (horario_atencion.DIA == 'Martes') {
        this.btnMasMartes = true;
        this.banderaCheckMartes = true;
        this.banderaDisableMartes = true;
        this.Editar_Dia_Atencion[1].Dia = horario_atencion.DIA;
        this.Editar_Dia_Atencion[1].Inicio_Jornada1 = horario_atencion.INICIO_JORNADA1;
        this.Editar_Dia_Atencion[1].Fin_Jornada1 = horario_atencion.FIN_JORNADA1;
        this.Editar_Dia_Atencion[1].Inicio_Jornada2 = horario_atencion.INICIO_JORNADA2;
        this.Editar_Dia_Atencion[1].Fin_Jornada2 = horario_atencion.FIN_JORNADA2;
        if (this.Editar_Dia_Atencion[1].Inicio_Jornada2 != null) {
          this.activarJ2(1);
          this.banderaDisableMartesJ2 = true;
        }
      }

      if (horario_atencion.DIA == 'Miercoles') {
        this.btnMasMiercoles = true;
        this.banderaCheckMiercoles = true;
        this.banderaDisableMiercoles = true;
        this.Editar_Dia_Atencion[2].Dia = horario_atencion.DIA;
        this.Editar_Dia_Atencion[2].Inicio_Jornada1 = horario_atencion.INICIO_JORNADA1;
        this.Editar_Dia_Atencion[2].Fin_Jornada1 = horario_atencion.FIN_JORNADA1;
        this.Editar_Dia_Atencion[2].Inicio_Jornada2 = horario_atencion.INICIO_JORNADA2;
        this.Editar_Dia_Atencion[2].Fin_Jornada2 = horario_atencion.FIN_JORNADA2;
        if (this.Editar_Dia_Atencion[2].Inicio_Jornada2 != null) {
          this.activarJ2(2);
          this.banderaDisableMiercolesJ2 = true;
        }
      }

      if (horario_atencion.DIA == 'Jueves') {
        this.btnMasJueves = true;
        this.banderaCheckJueves = true;
        this.banderaDisableJueves = true;
        this.Editar_Dia_Atencion[3].Dia = horario_atencion.DIA;
        this.Editar_Dia_Atencion[3].Inicio_Jornada1 = horario_atencion.INICIO_JORNADA1;
        this.Editar_Dia_Atencion[3].Fin_Jornada1 = horario_atencion.FIN_JORNADA1;
        this.Editar_Dia_Atencion[3].Inicio_Jornada2 = horario_atencion.INICIO_JORNADA2;
        this.Editar_Dia_Atencion[3].Fin_Jornada2 = horario_atencion.FIN_JORNADA2;
        if (this.Editar_Dia_Atencion[3].Inicio_Jornada2 != null) {
          this.activarJ2(3);
          this.banderaDisableJuevesJ2 = true;
        }
      }

      if (horario_atencion.DIA == 'Viernes') {
        this.btnMasViernes = true;
        this.banderaCheckViernes = true;
        this.banderaDisableViernes = true;
        this.Editar_Dia_Atencion[4].Dia = horario_atencion.DIA;
        this.Editar_Dia_Atencion[4].Inicio_Jornada1 = horario_atencion.INICIO_JORNADA1;
        this.Editar_Dia_Atencion[4].Fin_Jornada1 = horario_atencion.FIN_JORNADA1;
        this.Editar_Dia_Atencion[4].Inicio_Jornada2 = horario_atencion.INICIO_JORNADA2;
        this.Editar_Dia_Atencion[4].Fin_Jornada2 = horario_atencion.FIN_JORNADA2;
        if (this.Editar_Dia_Atencion[4].Inicio_Jornada2 != null) {
          this.activarJ2(4);
          this.banderaDisableViernesJ2 = true;
        }
      }

      if (horario_atencion.DIA == 'Sabado') {
        this.btnMasSabado = true;
        this.banderaCheckSabado = true;
        this.banderaDisableSabado = true;
        this.Editar_Dia_Atencion[5].Dia = horario_atencion.DIA;
        this.Editar_Dia_Atencion[5].Inicio_Jornada1 = horario_atencion.INICIO_JORNADA1;
        this.Editar_Dia_Atencion[5].Fin_Jornada1 = horario_atencion.FIN_JORNADA1;
        this.Editar_Dia_Atencion[5].Inicio_Jornada2 = horario_atencion.INICIO_JORNADA2;
        this.Editar_Dia_Atencion[5].Fin_Jornada2 = horario_atencion.FIN_JORNADA2;
        if (this.Editar_Dia_Atencion[5].Inicio_Jornada2 != null) {
          this.activarJ2(5);
          this.banderaDisableSabadoJ2 = true;
        }
      }

      if (horario_atencion.DIA == 'Domingo') {
        this.btnMasDomingo = true;
        this.banderaCheckDomingo = true;
        this.banderaDisableDomingo = true;
        this.Editar_Dia_Atencion[6].Dia = horario_atencion.DIA;
        this.Editar_Dia_Atencion[6].Inicio_Jornada1 = horario_atencion.INICIO_JORNADA1;
        this.Editar_Dia_Atencion[6].Fin_Jornada1 = horario_atencion.FIN_JORNADA1;
        this.Editar_Dia_Atencion[6].Inicio_Jornada2 = horario_atencion.INICIO_JORNADA2;
        this.Editar_Dia_Atencion[6].Fin_Jornada2 = horario_atencion.FIN_JORNADA2;
        if (this.Editar_Dia_Atencion[6].Inicio_Jornada2 != null) {
          this.activarJ2(6);
          this.banderaDisableDomingoJ2 = true;
        }
      }

    }
  }

  public almenosUnDia() {
    for (let objeto of this.Editar_Dia_Atencion) {
      if (objeto.Dia != null) {
        return true;
      }
    }
    return false;
  }

  public horarioObligatorio() {
    for (let objeto of this.Editar_Dia_Atencion) {
      debugger
      if (objeto.Dia != null && (objeto.Inicio_Jornada1 == null || objeto.Fin_Jornada1 == null) || ((objeto.Inicio_Jornada2 != null && objeto.Fin_Jornada2 == null) || (objeto.Inicio_Jornada2 == null && objeto.Fin_Jornada2 != null))) {
        return false;
      }
    }
    return true;
  }

  public banderaErrorHorario: boolean = false;

  public errorMensajeToast(mensaje) {
    let body = document.getElementById('body') as HTMLElement;
    body.scrollTo(0, 0);
    window.scroll(0, 0);
    this.toastr.error('<div class="row no-gutters"><p align="justify" class="col-12 LetrasToastInfo"><strong>!Error</strong><br>' + mensaje + '</p> </div>', "",
      {positionClass: 'toast-top-right', enableHtml: true, closeButton: true, disableTimeOut: false});
  }

  public verificarHorarioAtencion() {
    this.banderaValidaciones=true;
    if (this.EditarTienda.Horario_Atencion == 'Concreto') {
      if (this.almenosUnDia() == true) {
        if (this.horarioObligatorio() == true) {
          this.Tienda_Editar_Enviar.Editar_Dias_Atencion = this.Editar_Dia_Atencion;
          // console.log("DIAS DE ATENCION A ENVIAR AL BACKLOCAL " + JSON.stringify(this.Editar_Dia_Atencion));
            this.banderaValidaciones=true;
          if (this.validarFormulario()) {
            this.actualizarGeneral();
          } else {
            this.banderaErrorHorario = false;
            this.errorMensajeToast("Al parecer existe errores en el formulario reviselo nuevamente");
          }
        } else {
          this.banderaErrorHorario = true;
          this.errorMensajeToast("Debe ingresar el inicio y final de la jornada");
        }
      } else {
        debugger
        this.banderaErrorHorario = true;
        this.errorMensajeToast("Debe tener al menos un horario");
      }
    } else {
      debugger
      if (this.validarFormulario()) {
        this.actualizarGeneral();
      } else {
        this.banderaErrorHorario = false;
        this.errorMensajeToast("Al parecer existe errores en el formulario reviselo nuevamente");
      }
    }
  }


  public validarFormulario() {
    debugger
    // console.log('hola check' + document.forms["FormGeneralTienda"].checkValidity());
    if (document.forms["FormGeneralTienda"].checkValidity()) {
      return true;
    } else {
      return false;
    }
  }

  public async actualizarGeneral() {
    try {
      this.loading = true;
      this.Tienda_Editar_Enviar.EditarTienda = this.EditarTienda;
      // console.log("Esto quiero enviar de la TIENDA-----------" + JSON.stringify(this.Tienda_Editar_Enviar));
      let response = await this._tiendaServicio.actualizarTiendaGeneral(this.Tienda_Editar_Enviar, this.identidadTienda.NUM_TIENDA).toPromise();
      let data = await this._tiendaServicio.getDatosTienda(this.identidadTienda.NUM_TIENDA).toPromise();
      debugger
      localStorage.setItem("identityTienda", JSON.stringify(data['data']));
      this.cancelarModificacion();
      this.mensageCorrecto(response['message']);
      this.loading = false;
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

  }

  mensageCorrecto(mensaje) {
    this.banderaErrorHorario = false;
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

  public minusCorreo() {
    if (this.EditarTienda.Correo_Tienda != '' || this.EditarTienda.Correo_Tienda != null)
      this.EditarTienda.Correo_Tienda = this.EditarTienda.Correo_Tienda.toLowerCase();
  }

  public minusPagina() {
    if (this.EditarTienda.Link_Pagina != '' || this.EditarTienda.Link_Pagina!= null)
      this.EditarTienda.Link_Pagina = this.EditarTienda.Link_Pagina.toLowerCase();
  }

  public minusFacebook() {
    if (this.EditarTienda.Link_Facebook != '' || this.EditarTienda.Link_Facebook != null)
      this.EditarTienda.Link_Facebook = this.EditarTienda.Link_Facebook.toLowerCase();
  }

}
