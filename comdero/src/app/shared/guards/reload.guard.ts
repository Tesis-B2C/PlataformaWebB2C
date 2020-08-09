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

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class ReloadGuard implements CanDeactivate<ProductosComponent> {
  canDeactivate(target: ProductosComponent) {


    if (target.permisorecargar) {
      return true

    } else {
      return window.confirm('Esta seguro que desea abandonar el formulario ?');
    }
  }
}
