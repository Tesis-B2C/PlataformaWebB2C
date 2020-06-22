import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-metodos-envio',
  templateUrl: './metodos-envio.component.html',
  styleUrls: ['./metodos-envio.component.css']
})
export class MetodosEnvioComponent implements OnInit {
  public disabledRetiroLocal=true;

  constructor() {
  }

  ngOnInit() {
  }

  public clickRetiroLocal(event) {

    if (event.target.checked) {
      console.log('hola');
      this.disabledRetiroLocal=false;
    }
  }


}
