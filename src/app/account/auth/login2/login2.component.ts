import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { OwlOptions } from "ngx-owl-carousel-o";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";

import { environment } from "../../../../environments/environment";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-login2",
  templateUrl: "./login2.component.html",
  styleUrls: ["./login2.component.scss"],
})
/**
 * Login-2 component
 */
export class Login2Component implements OnInit {
  isLoginError: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService // private authFackservice: AuthfakeauthenticationService
  ) {}
  loginForm: FormGroup;
  submitted = false;
  error = "";
  returnUrl: string;

  // set the currenr year
  year: number = new Date().getFullYear();

  ngOnInit(): void {
    document.body.classList.add("auth-body-bg");
    this.loginForm = this.formBuilder.group({
      email: ["admin@LMSweb.com", [Validators.required, Validators.email]],
      password: ["123456", [Validators.required]],
    });

    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  carouselOption: OwlOptions = {
    items: 1,
    loop: false,
    margin: 0,
    nav: false,
    dots: true,
    responsive: {
      680: {
        items: 1,
      },
    },
  };

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
    this.authenticationService
      .userAuthentication(this.f.email.value, this.f.password.value)
      .subscribe(
        (data: any) => {
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("LoginName", data.userName);
          //  localStorage.setItem('LoginId', data.userId);
          this.router.navigate(["/dashboard"]);
        },
        (err: HttpErrorResponse) => {
          //console.log(err.error);
          this.error = err.error;
          this.isLoginError = true;
        }
      );
  }
}
