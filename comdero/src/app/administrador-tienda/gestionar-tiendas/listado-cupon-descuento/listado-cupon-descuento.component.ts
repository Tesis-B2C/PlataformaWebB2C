import {Component, OnInit} from '@angular/core';
import {DescuentoServicio} from "../../../servicios/descuento.servicio";
import {DatePipe} from '@angular/common';
import Swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-listado-cupon-descuento',
  templateUrl: './listado-cupon-descuento.component.html',
  styleUrls: ['./listado-cupon-descuento.component.css'],
  providers: [DatePipe]
})
export class ListadoCuponDescuentoComponent implements OnInit {

  public identidadTienda;
  public misDescuentos: any = [];
  public busqueda;

  public page = 1;
  public pageSize = 10;
  public vectorDescuentos = new Set();
  public result = [];

  public hoy;
  public descuentosPorBorrar = [];
  public loading: boolean = false;


  constructor(public datePipe: DatePipe, public _descuentoServicio: DescuentoServicio) {
  }

  async ngOnInit() {
    await this.traerDescuentos();
  }


  async traerDescuentos() {
    try {
      this.loading = true;

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

          if (this.datePipe.transform(this.hoy, "yyyy-MM-dd") == this.misDescuentos[i].FECHA_INICIO) {
            debugger;
            let horaActual = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
            if (this.obtenerMinutos(horaActual) < this.obtenerMinutos(this.misDescuentos[i].HORA_INICIO)) {
              this.misDescuentos[i].ESTADO_FECHA = "Programado";
            }
          }
          if (this.datePipe.transform(this.hoy, "yyyy-MM-dd") == this.misDescuentos[i].FECHA_FIN) {
            let horaActual = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
            if (this.obtenerMinutos(horaActual) > this.obtenerMinutos(this.misDescuentos[i].HORA_FIN)) {
              this.misDescuentos[i].ESTADO_FECHA = "Vencido";
            }
          }
        } else {
          this.misDescuentos[i].ESTADO_FECHA = "Desactivado"
        }
      }

      this.result = this.misDescuentos;
      // console.log("mis productos", this.vectorDescuentos);
      this.loading = false;
    } catch (e) {
      debugger;
      if (!(e instanceof HttpErrorResponse)) {
        console.log("error Parseado:" + typeof (e) + JSON.stringify(e));
        console.log("error como objeto:" + e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
  }


  obtenerMinutos(hora) {
    if (hora) {
      var spl = hora.split(":");
      return parseInt(spl[0]) * 60 + parseInt(spl[1]);
    }
  }


  public async filtrar() {
    this.loading = true;
    this.result = await this.search(this.busqueda);
    this.loading = false;
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
          debugger;
          this.misDescuentos[i].ESTADO_FECHA = "Desactivado"
        }
      }

      this.result = this.misDescuentos;

    } catch (e) {

      if (!(e instanceof HttpErrorResponse)){
        console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
        console.log("error como objeto:"+ e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }

  }

  public agregarTodosDesuentos(event) {
    if (event.target.checked) {
      debugger
      for (let i in this.result) {
        this.vectorDescuentos.add(this.result[i].ID_DESCUENTO);
      }
      // console.log("vector productos", this.vectorDescuentos)


    } else {
      this.vectorDescuentos = new Set();
    }

  }

  public agregarDescuento(event, cod) {
    if (event.target.checked) {
      debugger
      this.vectorDescuentos.add(cod);
      // console.log("vector productos", this.vectorDescuentos)
    } else {
      //this.vectorDescuentos = new Set();
      this.vectorDescuentos.delete(cod)
    }

  }

  public async cambiarEstadoDescuentos(estado) {
    try {
      this.descuentosPorBorrar = [];
      for (let descuento of this.vectorDescuentos) {
        this.descuentosPorBorrar.push(descuento);
      }
      let responseUpdate = await this._descuentoServicio.updateEstadoDescuentos(this.descuentosPorBorrar, estado).toPromise();
      this.mensageCorrecto(responseUpdate.message);
      this.vectorDescuentos = new Set();
      let response = await this._descuentoServicio.getMisDescuentos(this.identidadTienda.NUM_TIENDA).toPromise();
      this.misDescuentos = null;
      this.misDescuentos = response.data;
      this.result = this.misDescuentos;

    } catch (e) {

      if (!(e instanceof HttpErrorResponse)){
        console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
        console.log("error como objeto:"+ e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
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

      customClass: {
        confirmButton: 'btn btn-primary px-5',
        //icon:'sm'
      }
    });
  }

}
