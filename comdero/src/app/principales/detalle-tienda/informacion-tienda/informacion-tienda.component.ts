import {Component, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {ToastrService} from "ngx-toastr";
import {TiendaServicio} from "../../../servicios/tienda.servicio";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-informacion-tienda',
  templateUrl: './informacion-tienda.component.html',
  styleUrls: ['./informacion-tienda.component.css']
})
export class InformacionTiendaComponent implements OnInit {
  public Tienda;
  public idTienda;

  constructor(public toastr: ToastrService, public _tiendaServicio: TiendaServicio, public route: ActivatedRoute, public router: Router) {
  }

  async ngOnInit() {
    await this.getDetalleTiendaProducto();
    await this.iniciar();
  }


  async getDetalleTiendaProducto() {
    try {
      this.idTienda = this.route.parent.snapshot.params.id;
      let response = await this._tiendaServicio.getDetalleTiendaProducto(this.idTienda).toPromise();
      this.Tienda = response.data;
      console.log("tienda buscada INFORMACION ", this.Tienda);
    } catch (e) {
      console.log("error:" + e);
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else{
        this.mensageError("Error de conexión intentelo mas tarde");
        debugger;
        this.router.navigate(['/principales/menu/principal'])
      }
    }

  }

  objEfectivo = {
    Tipo_Pago: null,
    Descuento: null
  };
  objElectronico = {
    Tipo_Pago: null,
    Recargo: null,
  };
  objTransferencia = {
    Tipo_Pago: null,
    Descuento: null,
    Tipo_Cuenta: null,
    Banco_Pertenece: null,
    Numero_cuenta: null

  };

  iniciar() {
    this.objEfectivo = {
      Tipo_Pago: null,
      Descuento: 0
    };
    this.objElectronico = {
      Tipo_Pago: null,
      Recargo: 0,
    };
    this.objTransferencia = {
      Tipo_Pago: null,
      Descuento: 0,
      Tipo_Cuenta: null,
      Banco_Pertenece: null,
      Numero_cuenta: null

    };
    for (let pago of this.Tienda.METODO_PAGOs) {
      debugger;
      if (pago.TIPO_PAGO == 'Efectivo') {
        this.objEfectivo.Tipo_Pago = pago.TIPO_PAGO;
        this.objEfectivo.Descuento = pago.PORCENTAJE_DESCUENTO
      }

      if (pago.TIPO_PAGO == 'Transferencia') {
        this.objTransferencia.Tipo_Pago = pago.TIPO_PAGO;
        this.objTransferencia.Descuento = pago.PORCENTAJE_DESCUENTO;
        this.objTransferencia.Tipo_Cuenta = pago.TIPO_CUENTA;
        this.objTransferencia.Banco_Pertenece = pago.BANCO_PERTENECE;
        this.objTransferencia.Numero_cuenta = pago.NUMERO_CUENTA;
      }

      if (pago.TIPO_PAGO == 'Electrónico') {
        this.objElectronico.Tipo_Pago = pago.TIPO_PAGO;
        this.objElectronico.Recargo = pago.PORCENTAJE_RECARGO;

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
      //footer: '<a href="http://localhost:4200/loguin"><b><u>Autentificate Ahora</u></b></a>',
      customClass: {
        confirmButton: 'btn btn-primary px-5',
        //icon:'sm'
      }
    });
  }
}
