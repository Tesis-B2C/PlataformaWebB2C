import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit ,DoCheck {
  public bandetTipo;
  constructor()
  {

  }

  ngOnInit() {
  this.bandetTipo=true;
  }
  ngDoCheck()
  {

  }
selectAdminsitrador(tipo)
  {
  this.bandetTipo = !this.bandetTipo;
  console.log(this.bandetTipo);
  }
}
