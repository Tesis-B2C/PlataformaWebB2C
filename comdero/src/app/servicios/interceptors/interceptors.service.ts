import {Injectable} from '@angular/core';
import {HttpHandler, HttpRequest, HttpInterceptor, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import Swal from "sweetalert2";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class InterceptorsService implements HttpInterceptor {
  constructor(public router: Router, public toastr: ToastrService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError(error => {
        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Client-side error: ${error.error.message}`;
        } else {
          // backend error
          errorMessage = ` Server side Error Status: ${error.status}\nMessage: ${error.message}`;

          if (error instanceof HttpErrorResponse) {

            if (error.status === 400) {
              this.toastr.error('<div class="row no-gutters"><p class="col-12 LetrasToastInfo"><strong>!Error</strong><br>' + JSON.stringify((error).error.message) + '</p> </div>', "",
                {positionClass: 'toast-top-right', enableHtml: true, closeButton: true});
            } else if (error.status === 401) {
              console.log("Error 401");
              this.mensageError(JSON.stringify((error).error.message));
            } else if (error.status === 402) {
              console.log("Error 402");
              this.mensageError(JSON.stringify((error).error.message));
            } else if (error.status === 403) {
              console.log("Error 403");
              this.mensageError(JSON.stringify((error).error.message));
            } else if (error.status === 404) {
              console.log("Error 404");
              this.router.navigate(['/error404']);
            } else if (error.status === 500) {
              console.log("Error 500");
              this.router.navigate(['/error500']);
            } else if (error.status === 0) {
              console.log("Error 0");
              this.router.navigate(['/error0']);
            }
          }
        }

        // aquí podrías agregar código que muestre el error en alguna parte fija de la pantalla.
        console.log("lo estoy capturando ", errorMessage);
        return throwError(error);
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


