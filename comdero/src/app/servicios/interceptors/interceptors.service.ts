import {Injectable} from '@angular/core';
import {HttpHandler, HttpRequest, HttpInterceptor, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import Swal from "sweetalert2";
import {ToastrService} from "ngx-toastr";


@Injectable({
  providedIn: 'root'
})
export class InterceptorsService implements HttpInterceptor {
  constructor( public toastr: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError(error => {
        let errorMessage = '';
        if (error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Client-side error: ${error.error.message}`;
        } else {
          // backend error
          errorMessage = 'Error del servidor : Estatus:'+ error.status+'Servidor:'+ error.message+'Usuario:'+JSON.stringify((error).error.message);

          if (error instanceof HttpErrorResponse) {

            if (error.status === 400) {
              // realiza la acción que necesites,
              // en tu caso la redirección a la ruta para 404 que creaste
              this.toastr.error('<div class="row no-gutters"><p class="col-12 LetrasToastInfo"><strong>!Error</strong><br>' + JSON.stringify((error).error.message) + '</p> </div>', "",
                {positionClass: 'toast-top-right', enableHtml: true, closeButton: true});
            }

            if (error.status === 403) {
              // realiza la acción que necesites,
              // en tu caso la redirección a la ruta para 404 que creaste
             /* console.log("Error 403" + JSON.stringify((error).error.message));
              this.mensageError(JSON.stringify((error).error.message))*/
            }

            if (error.status === 404) {
              // realiza la acción que necesites,
              // en tu caso la redirección a la ruta para 404 que creaste
              console.log("Error 404");
            }
            if (error.status === 500) {
              console.log("Error 500");
              // otra acción distinta, por ejemplo...
            }

            if (error.status === 0) {
              console.log("Error 0");
              // otra acción distinta, por ejemplo...
            }
          }
        }

        // aquí podrías agregar código que muestre el error en alguna parte fija de la pantalla.
        console.log("lo estoy capturando ", errorMessage);
        return throwError(errorMessage);
      })
    );
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

}


