import {Injectable} from '@angular/core';
import {
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanDeactivate
} from '@angular/router';
import {Observable} from 'rxjs';
import {ProductosComponent} from "../../administrador-tienda/gestionar-tiendas/productos/productos.component";
import Swal from "sweetalert2";

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class ReloadGuard implements CanDeactivate<ProductosComponent> {
  canDeactivate(target: ProductosComponent) {

    if (target.permisorecargar) {
      return true

    } else {
    //  return window.confirm('Esta seguro que desea abandonar el formulario ?');
     return  Swal.fire({
        title: '<header class="login100-form-title-registro mb-0"><h5 class="card-title"><strong>¿Estas seguro que deseas abandonar la página?</strong></h5></header>',
        text: "Los datos introducidos no se guardaran ",
        icon: 'warning',
        position: 'center',
        width: 600,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn btn-primary px-3 ',
          container: 'my-swal',
          cancelButton: 'btn btn-light px-3 ml-5',
        }
      }).then((result) => {
        if (result.value) {
          return true
        }
      })

    }


  }
}
