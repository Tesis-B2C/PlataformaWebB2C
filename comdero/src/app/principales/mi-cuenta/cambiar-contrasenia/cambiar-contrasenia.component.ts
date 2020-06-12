import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cambiar-contrasenia',
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrls: ['./cambiar-contrasenia.component.css']
})
export class CambiarContraseniaComponent implements OnInit {
  public comprarContrasenia;
public objCambiarContrasenia={
  contraseniaActual:null,
  contraseniaNueva:null
}
  constructor() { }

  ngOnInit() {
  }


}
