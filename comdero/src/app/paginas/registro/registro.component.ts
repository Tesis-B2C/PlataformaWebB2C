import {Component, OnInit, DoCheck} from '@angular/core';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit, DoCheck {
  public bandetTipo;
 public nombre;
  //tslint:disable-next-line: max-line-length
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public soloLetrasPattern;
  private LetrasNumerosPattern: any = /^[ a-z 0-9 ][ a-z 0-9 ]*$/
  private soloNumerosPattern: any = /^[0-9][0-9]*$[A-Z]{0}/
  private passwordPattern:any = null;

  constructor() {
    this.soloLetrasPattern= "[ a-zA-Z ][ a-zA-Z ]*$[0-9]{0}";
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
