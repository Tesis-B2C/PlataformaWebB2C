import { Component, OnInit } from '@angular/core';
import {AgenteServicio} from "../../../servicios/agente.servicio";

@Component({
  selector: 'app-vision-general',
  templateUrl: './vision-general.component.html',
  styleUrls: ['./vision-general.component.css']
})
export class VisionGeneralComponent implements OnInit {
 public identidad;
  constructor(public _agenteServicio:AgenteServicio) { }

  ngOnInit() {
    this.identidad = this._agenteServicio.getIdentity();
  }

}
