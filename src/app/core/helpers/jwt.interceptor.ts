import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthenticationService } from "../services/authentication.service";
import { CookieService } from "ngx-cookie-service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  // constructor(private authenticationService: AuthenticationService, private authfackservice: AuthfakeauthenticationService) { }

  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //     if (environment.defaultauth === 'firebase') {
  //         const currentUser = this.authenticationService.currentUser();
  //         if (currentUser && currentUser.token) {
  //             request = request.clone({
  //                 setHeaders: {
  //                     Authorization: `Bearer ${currentUser.token}`
  //                 }
  //             });
  //         }
  //     } else {
  //         // add authorization header with jwt token if available
  //         const currentUser = this.authfackservice.currentUserValue;
  //         if (currentUser && currentUser.token) {
  //             request = request.clone({
  //                 setHeaders: {
  //                     Authorization: `Bearer ${currentUser.token}`
  //                 }
  //             });
  //         }
  //     }
  //     return next.handle(request);
  // }
  constructor(
    private authenticationService: AuthenticationService,
    public _cookiesService: CookieService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const authToken = `Bearer ${this._cookiesService.get("authToken")}`;

    if (authToken) {
      request = request.clone({
        setHeaders: {
          ["Authorization"]: authToken,
        },
      });
    }

    return next.handle(request);
  }
}
