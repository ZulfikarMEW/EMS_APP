import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

// import { AuthfakeauthenticationService } from "../../../core/services/authfake.service";

import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";

import { CookieService } from "ngx-cookie-service";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { HttpErrorResponse, JsonpClientBackend } from "@angular/common/http";
import { UserProfileService } from "src/app/core/services/user.service";
import { SystemfunctionService } from "src/app/core/services/systemfunction.service";
import { SystemRole } from "src/app/core/models/SystemRole";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  error = "";
  returnUrl: string;
  isLoginError = false;
  submittd = false;
  isLoginSuccessful: boolean = false;
  userAccess: SystemRole = new SystemRole();

  // set the currenr year
  year: number = new Date().getFullYear();

  errorMessage: string = "";

  showPassword: boolean = false;

  // tslint:disable-next-line: max-line-length
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userprofile: UserProfileService,
    private systemFunction: SystemfunctionService,
    // private authenticationService: AuthenticationService,
    // private authFackservice: AuthfakeauthenticationService,
    private authService: AuthenticationService,
    public _cookiesService: CookieService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    // this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Form submit
   */
  // onSubmit() {
  //   this.submitted = true;

  //   // stop here if form is invalid
  //   if (this.loginForm.invalid) {
  //     return;
  //   } else {
  //     if (environment.defaultauth === "firebase") {
  //       this.authenticationService
  //         .login(this.f.email.value, this.f.password.value)
  //         .then((res: any) => {
  //           this.router.navigate(["/dashboard"]);
  //         })
  //         .catch((error) => {
  //           this.error = error ? error : "";
  //         });
  //     } else {
  //       this.authFackservice
  //         .login(this.f.email.value, this.f.password.value)
  //         .pipe(first())
  //         .subscribe(
  //           (data) => {
  //             this.router.navigate(["/dashboard"]);
  //           },
  //           (error) => {
  //             this.error = error ? error : "";
  //           }
  //         );
  //     }
  //   }
  // }

  onSubmit() {
    this.authService
      .userAuthentication(this.f.email.value, this.f.password.value)
      .subscribe(
        (data: any) => {
          this._cookiesService.set("authToken", data.access_token);
          ////console.log(data);
          this.isLoginSuccessful = true;
          //localStorage.setItem("token", data.access_token);
          // localStorage.setItem("LoginName", data.userName);
          //  localStorage.setItem('LoginId', data.userId);

          this.userprofile.getUserProfile().subscribe((res: any) => {
            ////console.log(res);
            this.systemFunction.changeUser(res);
            this.router.navigate(["/dashboard"]);
          });

          // this.userprofile.getUserRoleFunction().subscribe((res: any) => {
          //   this._cookiesService.set("access", JSON.stringify(res));
          //   // this.systemFunction.changeUser(res);
          // });
        },
        (err: HttpErrorResponse) => {
          this.isLoginSuccessful = false;
          //console.log(err.error);
          this.error = err.error;
          this.isLoginError = true;
        }
      );
  }
}
