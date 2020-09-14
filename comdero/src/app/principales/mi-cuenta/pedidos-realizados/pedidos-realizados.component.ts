import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pedidos-realizados',
  templateUrl: './pedidos-realizados.component.html',
  styleUrls: ['./pedidos-realizados.component.css']
})
export class PedidosRealizadosComponent implements OnInit {
  currentJustify = 'start';
  constructor() { }

  ngOnInit() {
  }

}
