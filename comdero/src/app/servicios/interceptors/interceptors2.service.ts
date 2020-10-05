import {Injectable} from '@angular/core';
import {HttpHandler, HttpRequest, HttpInterceptor, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

import {LoadingBarModule, LoadingBarService} from "@ngx-loading-bar/core";
import {finalize, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Interceptors2Service implements HttpInterceptor {
  constructor(public loadingService: LoadingBarService, public router: Router, public toastr: ToastrService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    if (req.headers.has('ignoreLoadingBar')) {
      return next.handle(req.clone({headers: req.headers.delete('ignoreLoadingBar')}));
    }
    let started = false;
    const ref = this.loadingService;
    return next.handle(req).pipe(
      tap(() => {
        if (!started) {
          ref.start();
          started = true;
        }
      }),
      finalize(() => started && ref.complete()),
    );


  }



}


