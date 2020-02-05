import {Component, OnInit, DoCheck} from '@angular/core';
import { Agente } from "../modelos/agente";

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
  public soloLetrasPattern:any="[ a-zA-Z ][ a-zA-Z ]*$[0-9]{0}";
  private LetrasNumerosPattern: any = "[ .a-z 0-9 ][ .a-z 0-9 ]*$";
  private soloNumerosPattern: any = "[0-9][0-9]*$[A-Z]{0}";


  constructor() {
    this.Agente= new Agente("","","",
      "","","","","","",
      "","",);
  }



  ngOnInit() {
    this.bandetTipo = true;

  }

  ngDoCheck() {

  }

  selectAdminsitrador() {
    this.bandetTipo = !this.bandetTipo;
    console.log(this.bandetTipo);
  }



}
