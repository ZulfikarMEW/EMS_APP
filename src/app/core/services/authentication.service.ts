import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  apiUrl = environment.baseUrl.replace("MEW/", ""); //"https://localhost:44350/";

  constructor(
    private http: HttpClient,
    public _cookiesService: CookieService,
    private router: Router
  ) {}

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  };

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("An error occurred:", error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError("Something bad happened; please try again later.");
  }

  userAuthentication(userName, password) {
    const data =
      "username=" + userName + "&password=" + password + "&grant_type=password";
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/x-www-urlencoded",
    });
    return this.http
      .post(this.apiUrl + "token", data, { headers: reqHeader })
      .pipe(catchError(this.handleError));
  }

  logout() {
    this._cookiesService.deleteAll("/");
    localStorage.clear();
    this.router.navigate(["/dashboard"]);
  }
}
