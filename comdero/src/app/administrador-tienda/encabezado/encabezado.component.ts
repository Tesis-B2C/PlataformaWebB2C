import { Component, OnInit } from '@angular/core';
import {AgenteServicio} from "../../servicios/agente.servicio";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificacionesServicio} from "../../servicios/notificaciones.servicio";
import {WebSocketService} from "../../servicios/WebSockets/web-socket.service";

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css']
})
export class EncabezadoComponent implements OnInit {

  constructor() { }

  ngOnInit() {



  }

}
