import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-metodos-envio',
  templateUrl: './metodos-envio.component.html',
  styleUrls: ['./metodos-envio.component.css']
})
export class MetodosEnvioComponent implements OnInit {
  public disabledRetiroLocal = true;
  public disabledEnvioDomicilio = true;

  constructor() {
  }

  ngOnInit() {
  }

  public clickRetiroLocal(event) {
    if (event.target.checked) {
      this.disabledRetiroLocal = false;
    } else {
      this.disabledRetiroLocal = true;
    }
  }

  public clickEnvioDomicilio(event) {
    if (event.target.checked) {
      this.disabledEnvioDomicilio = false;
    } else {
      this.disabledEnvioDomicilio = true;
    }

  }


}
