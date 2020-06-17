import {Component, OnInit} from '@angular/core';
import {Tienda} from "../../../modelos/tienda";
import {Horario_Atencion} from "../../../modelos/horario_atencion";

@Component({
  selector: 'app-general-tienda',
  templateUrl: './general-tienda.component.html',
  styleUrls: ['./general-tienda.component.css']
})
export class GeneralTiendaComponent implements OnInit {
  public Tienda;
  public Dias_Atencion = [];

  public htmlcomponent;
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


  constructor() {
    this.Tienda = new Tienda(null, null, null, null, null,
      null, null, null, null, null, null, null);
  }


  ngOnInit() {
    for (let i = 0; i < 7; i++)
      this.Dias_Atencion.push(new Horario_Atencion(null, null, null, null, null));
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

  public horarioRadio(Tipo) {
    if (Tipo == "Concreto") {         /*Tipo Horas Concretas*/
      this.banderaHoraConcreta = true;
      console.log(this.Dias_Atencion);
    } else {
      this.banderaHoraConcreta = false;
    }

    this.Tienda.Tipo_Horario = Tipo;
    console.log(this.Tienda);
  }

  public horarioCheckLunes(event) {
    if (event.target.checked) {
      this.banderaDisableLunes = false;
      this.btnMasLunes = true;
    } else {
      this.banderaDisableLunes = true;
      this.btnMasLunes = false;
      this.banderaActivaLunesJ2 = false;
    }
  }

  public horarioCheckMartes(event) {
    if (event.target.checked) {
      this.banderaDisableMartes = false;
      this.btnMasMartes = true;
    } else {
      this.banderaDisableMartes = true;
      this.btnMasMartes = false;
      this.banderaActivaMartesJ2 = false;
    }
  }

  public horarioCheckMiercoles(event) {
    if (event.target.checked) {
      this.banderaDisableMiercoles = false;
      this.btnMasMiercoles = true;
    } else {
      this.banderaDisableMiercoles = true;
      this.btnMasMiercoles = false;
      this.banderaActivaMiercolesJ2 = false;
    }
  }

  public horarioCheckJueves(event) {
    if (event.target.checked) {
      this.banderaDisableJueves = false;
      this.btnMasJueves = true;
    } else {
      this.banderaDisableJueves = true;
      this.btnMasJueves = false;
      this.banderaActivaJuevesJ2 = false;
    }
  }

  public horarioCheckViernes(event) {
    if (event.target.checked) {
      this.banderaDisableViernes = false;
      this.btnMasViernes = true;
    } else {
      this.banderaDisableViernes = true;
      this.btnMasViernes = false;
      this.banderaActivaViernesJ2 = false;
    }
  }

  public horarioCheckSabado(event) {
    if (event.target.checked) {
      this.banderaDisableSabado = false;
      this.btnMasSabado = true;
    } else {
      this.banderaDisableSabado = true;
      this.btnMasSabado = false;
      this.banderaActivaSabadoJ2 = false;
    }
  }

  public horarioCheckDomingo(event) {
    if (event.target.checked) {
      this.banderaDisableDomingo = false;
      this.btnMasDomingo = true;
    } else {
      this.banderaDisableDomingo = true;
      this.btnMasDomingo = false;
      this.banderaActivaDomingoJ2 = false;
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
      this.btnMasSabado= true;
    }

    if (dia == 6) {
      this.banderaActivaDomingoJ2 = false;
      this.btnMasDomingo = true;
    }
  }

  /*-----------FIN HORARIO ATENCION--------------*/


}
