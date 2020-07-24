import {Component, OnInit} from '@angular/core';
import {DescuentoServicio} from "../../../servicios/descuento.servicio";
import {DatePipe} from '@angular/common';
import Swal from "sweetalert2";

@Component({
  selector: 'app-listado-cupon-descuento',
  templateUrl: './listado-cupon-descuento.component.html',
  styleUrls: ['./listado-cupon-descuento.component.css'],
  providers: [DatePipe]
})
export class ListadoCuponDescuentoComponent implements OnInit {

  public identidadTienda;
  public misDescuentos;
  public busqueda;

  public page = 1;
  public pageSize = 10;
  public vectorDescuentos = new Set();
  public result = [];

  public hoy;

  constructor(private datePipe: DatePipe, private _descuentoServicio: DescuentoServicio) {
  }

  async ngOnInit() {

    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));
    let response = await this._descuentoServicio.getMisDescuentos(this.identidadTienda.NUM_TIENDA).toPromise();
    this.misDescuentos = response.data;
    this.hoy = new Date();
    for (let i in this.misDescuentos) {
      if (this.misDescuentos[i].ESTADO_DESCUENTO == 0) {
        if (this.datePipe.transform(this.hoy, "yyyy-MM-dd") < this.misDescuentos[i].FECHA_INICIO) {
          this.misDescuentos[i].ESTADO_FECHA = "Programado"
        }
        if (this.datePipe.transform(this.hoy, "yyyy-MM-dd") > this.misDescuentos[i].FECHA_FIN) {
          this.misDescuentos[i].ESTADO_FECHA = "Vencido"
        }

        if (this.datePipe.transform(this.hoy, "yyyy-MM-dd") >= this.misDescuentos[i].FECHA_INICIO && this.datePipe.transform(this.hoy, "yyyy-MM-dd") <= this.misDescuentos[i].FECHA_FIN) {
          this.misDescuentos[i].ESTADO_FECHA = "Activo"
        }
      } else {
        this.misDescuentos[i].ESTADO_FECHA = "Desactivado"
      }
    }

    debugger;
    this.result = this.misDescuentos;
    console.log("mis productos", this.vectorDescuentos);


  }

  public async filtrar() {
    this.result = await this.search(this.busqueda);
  }

  public search(text: string): any[] {
    return this.misDescuentos.filter(descuento => {
      const term = text.toLowerCase();
      debugger
      return descuento.MOTIVO_DESCUENTO.toLowerCase().includes(term) || descuento.TIPO_DESCUENTO.toLowerCase().includes(term)  // || siguiente
    });
  }


  public async cambiarEstadoDescuento(Id_Descuento, estado) {

    try {
      let responseUpdate = await this._descuentoServicio.updateEstadoDescuento(Id_Descuento, estado).toPromise();
      this.mensageCorrecto(responseUpdate.message);
      let response = await this._descuentoServicio.getMisDescuentos(this.identidadTienda.NUM_TIENDA).toPromise();
      this.misDescuentos = null;
      this.misDescuentos = response.data;
      for (let i in this.misDescuentos) {
        if (this.misDescuentos[i].ESTADO_DESCUENTO==0) {
          if (this.datePipe.transform(this.hoy, "yyyy-MM-dd") < this.misDescuentos[i].FECHA_INICIO) {
            this.misDescuentos[i].ESTADO_FECHA = "Programado"
          }
          if (this.datePipe.transform(this.hoy, "yyyy-MM-dd") > this.misDescuentos[i].FECHA_FIN) {
            this.misDescuentos[i].ESTADO_FECHA = "Vencido"
          }

          if (this.datePipe.transform(this.hoy, "yyyy-MM-dd") >= this.misDescuentos[i].FECHA_INICIO && this.datePipe.transform(this.hoy, "yyyy-MM-dd") <= this.misDescuentos[i].FECHA_FIN) {
            this.misDescuentos[i].ESTADO_FECHA = "Activo"
          }
        } else {
          debugger;
          this.misDescuentos[i].ESTADO_FECHA = "Desactivado"
        }
      }

      this.result = this.misDescuentos;

    } catch (e) {

      console.log("error:" + e);
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
    }

  }


  mensageError(mensaje) {
    Swal.fire({
      icon: 'error',
      title: '<header class="login100-form-title-registro"><h5 class="card-title">!Error..</h5></header>',
      text: mensaje,
      position: 'center',
      width: 600,
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-primary px-5',
        container: 'my-swal'
        //icon:'sm'
      }
    });
  }


  mensageCorrecto(mensaje) {
    Swal.fire({
      icon: 'success',
      title: '<header class="login100-form-title-registro"><h5 class="card-title">!Correcto..</h5></header>',
      text: mensaje,
      position: 'center',
      width: 600,
      buttonsStyling: false,
      //footer: '<a href="http://localhost:4200/loguin"><b><u>Autentificate Ahora</u></b></a>',
      customClass: {
        confirmButton: 'btn btn-primary px-5',
        //icon:'sm'
      }
    });
  }

}
