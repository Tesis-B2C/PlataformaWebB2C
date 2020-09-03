import {Component, OnInit} from '@angular/core';
import {TiendaServicio} from "../../../servicios/tienda.servicio";
import {ActivatedRoute, Router} from "@angular/router";
import Swal from "sweetalert2";
import {NgbRatingConfig} from "@ng-bootstrap/ng-bootstrap";
import { GLOBAL } from 'src/app/servicios/global';

@Component({
  selector: 'app-inicio-tienda',
  templateUrl: './inicio-tienda.component.html',
  styleUrls: ['./inicio-tienda.component.css'],
  providers: [NgbRatingConfig]
})
export class InicioTiendaComponent implements OnInit {
  public idTienda;
  public Tienda: any;
  currentRate = 1;

  public page = 1;
  public pageSize = 15;
  public result = [];

  public loading: boolean = false;
  public busqueda;

  constructor(configRating: NgbRatingConfig, public _tiendaServicio: TiendaServicio, public route: ActivatedRoute, public router: Router) {
    configRating.max = 5;
    configRating.readonly = true;
    // customize default values of carousels used by this component tree

  }

  async ngOnInit() {
    this.loading = true;
    await this.getDetalleTiendaProducto();
    this.result = this.Tienda.OFERTA;
    this.loading = false;
  }

  async getDetalleTiendaProducto() {
    try {
      this.idTienda = this.route.parent.snapshot.params.id;
      let response = await this._tiendaServicio.getDetalleTiendaProducto(this.idTienda).toPromise();
      this.Tienda = response.data;
      console.log("tienda buscada en inicio pilas", this.Tienda);
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

  public noExiste;
  getImagen(pathImagen) {
    this.noExiste = 'assets/images/no-image.png';
    if (pathImagen) {
      this.noExiste = GLOBAL.urlImagen + pathImagen;
    }
    return this.noExiste;
  }


  public async filtrar() {
    this.busqueda = this.busqueda.trim();
    this.loading = true;
    this.result = await this.search(this.busqueda);
    this.loading = false;
  }

  public search(text: string): any[] {
    return this.Tienda.OFERTA.filter(producto => {
      const term = text.toLowerCase();
      debugger
      return producto.PRODUCTO.NOMBRE_PRODUCTO.toLowerCase().includes(term)  // || siguiente

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
