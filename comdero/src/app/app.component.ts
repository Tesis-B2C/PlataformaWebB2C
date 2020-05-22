import {Component, OnInit} from '@angular/core';
import {AgenteServicio} from "./servicios/agente.servicio";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'comdero';

  public token;
  public identity;
  constructor(private _agenteService: AgenteServicio) {
  }

  ngOnInit() {
    this.identity = this._agenteService.getIdentity();
    this.token = this._agenteService.getToken();
    console.log("las vaibles del Storage");
    console.log(this.identity + this.token);
  }


}
