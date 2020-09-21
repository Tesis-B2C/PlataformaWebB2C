import {Component, OnInit} from '@angular/core';
import {CompraServicio} from "../../../servicios/compra.servicio";
import {TiendaServicio} from "../../../servicios/tienda.servicio";
import Swal from "sweetalert2";

@Component({
  selector: 'app-listado-clientes',
  templateUrl: './listado-clientes.component.html',
  styleUrls: ['./listado-clientes.component.css']
})
export class ListadoClientesComponent implements OnInit {
  public identidadTienda;
  public page = 1;
  public pageSize = 10;
  public result = [];
  public loading: boolean;
  public busqueda;
  public misClientes;
  constructor(public _tiendaServicio: TiendaServicio) {
  }

  ngOnInit() {
    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));
    this.getClientes();
  }


  async getClientes() {
    this.loading=true;
    try {
      let response = await this._tiendaServicio.getListadoClientesTienda(this.identidadTienda.NUM_TIENDA).toPromise();
       this.misClientes=response.data;
       this.result=this.misClientes;
       this.loading=false;
    } catch (e) {
      this.loading=false;
      console.log("error", e);
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo más tarde");
    }
  }
  public async filtrar() {

    this.result = await this.search(this.busqueda);

  }

  public search(text: string): any[] {
    return this.misClientes.filter(cliente => {
      const term = text.toLowerCase();

      return cliente.TELEFONO_FACTURA.toLowerCase().includes(term) || cliente.NOMBRE_FACTURA.toLowerCase().includes(term) || cliente.IDENTIFICACION_FACTURA.toLowerCase().includes(term) // || siguiente
    });
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
