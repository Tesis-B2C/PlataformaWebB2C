import { Component, OnInit } from '@angular/core';
import {AgenteServicio} from "../../servicios/agente.servicio";

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css']
})
export class EncabezadoComponent implements OnInit {

  constructor(private _agenteServicio:AgenteServicio) { }

  ngOnInit() {
  }

}
