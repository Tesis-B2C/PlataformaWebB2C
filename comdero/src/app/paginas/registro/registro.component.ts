import {Component, DoCheck, OnInit} from '@angular/core';
import {Agente} from "../modelos/agente";
import {DpaServicio} from "../../servicios/dpa.servicio"

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit, DoCheck {
  public bandetTipo;
  public Agente;
  //tslint:disable-next-line: max-line-length
  private emailPattern: any = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$";
  public soloLetrasPattern: any = "[ a-zA-Z ][ a-zA-Z ]*$[0-9]{0}";
  private LetrasNumerosPattern: any = "[ .a-z 0-9 ][ .a-z 0-9 ]*$";
  private soloNumerosPattern: any = "[0-9][0-9]*$[A-Z]{0}";
  public banderToast: boolean;


  public provincias;

  constructor(private _dpaServicio: DpaServicio) {
    this.Agente = new Agente("", "", "",
      "", "", "", "", "", "",
      "", "",);
  }



  ngOnInit() {
    console.log("!INIT");
    this.bandetTipo = true;
    this.banderToast = false;
    this.obtenerProvincias();

  }

  ngDoCheck() {
    this.banderToast;
  }

  selectAdminsitrador() {
    this.bandetTipo = !this.bandetTipo;
    console.log(this.bandetTipo);
  }

  registrarAgente(validador) {
    console.log(validador);
    if (validador == "0") {
      //this.banderToast=false;

    } else {
      console.log("entre");
      this.banderToast = true;
      window.scroll(0, 0);
    }
  }

  async obtenerProvincias() {

    try {
      let response=  await this._dpaServicio.getAllDpa().toPromise();
      console.log("ee",response)
      this.provincias=response.data;

    }catch (e) {
      console.log("error:"+JSON.stringify((e).error.message));
    }


  }





}
