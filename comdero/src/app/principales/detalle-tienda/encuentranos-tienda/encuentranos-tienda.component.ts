import {Component, OnInit} from '@angular/core';
import {TiendaServicio} from "../../../servicios/tienda.servicio";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import {Sucursal} from "../../../modelos/sucursal";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-encuentranos-tienda',
  templateUrl: './encuentranos-tienda.component.html',
  styleUrls: ['./encuentranos-tienda.component.css']
})
export class EncuentranosTiendaComponent implements OnInit {
  public identidadTienda;
  public idTienda;
  public Sucursales = [];

  constructor(public toastr: ToastrService, private _tiendaServicio: TiendaServicio, private route: ActivatedRoute,private router: Router) {
  }

  async ngOnInit() {
    await this.getDetalleTiendaProducto();
    await this.iniciar();
  }


  public iniciar() {
    for (let i in this.identidadTienda.SUCURSALs) {
      this.Sucursales.push(new Sucursal(this.identidadTienda.SUCURSALs[i].RUC, this.identidadTienda.SUCURSALs[i].DIRECCION_SUCURSAL, this.identidadTienda.SUCURSALs[i].TELEFONO_SUCURSAL, null, null, this.identidadTienda.SUCURSALs[i].NUM_COD_POSTAL_SUCURSAL, this.identidadTienda.SUCURSALs[i].NUM_REFERENCIA, this.identidadTienda.SUCURSALs[i].DPA.COD_DPA, this.identidadTienda.SUCURSALs[i].TIPO_SUCURSAL));
      console.log(this.Sucursales.length + JSON.stringify(this.Sucursales));
    }
  }


  async getDetalleTiendaProducto() {
    try {
      this.idTienda = this.route.parent.snapshot.params.id;
      let response = await this._tiendaServicio.getDetalleTiendaProducto(this.idTienda).toPromise();
      this.identidadTienda = response.data;
      console.log("tienda buscada encuentranos ", this.identidadTienda);
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


