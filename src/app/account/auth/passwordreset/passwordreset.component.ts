import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { UserProfileService } from "src/app/core/services/user.service";
import Swal from "sweetalert2";
import { SetPassword } from "./ResetPassword";

@Component({
  selector: "app-passwordreset",
  templateUrl: "./passwordreset.component.html",
  styleUrls: ["./passwordreset.component.scss"],
})

/**
 * Reset-password component
 */
export class PasswordresetComponent implements OnInit, AfterViewInit {
  resetForm: FormGroup;
  submitted = false;
  error = "";
  success = "";
  loading = false;

  // set the currenr year
  year: number = new Date().getFullYear();
  passworReset: SetPassword = new SetPassword();

  // tslint:disable-next-line: max-line-length
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserProfileService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  ngAfterViewInit() {}

  // convenience getter for easy access to form fields
  get f() {
    return this.resetForm.controls;
  }

  generatePassword(passwordLength) {
    var numberChars = "0123456789";
    var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lowerChars = "abcdefghijklmnopqrstuvwxyz";
    var symbols = "!@#$%^&*_<>=";
    var allChars = numberChars + upperChars + lowerChars;
    var randPasswordArray = Array(passwordLength);
    randPasswordArray[0] = numberChars;
    randPasswordArray[1] = upperChars;
    randPasswordArray[2] = lowerChars;
    randPasswordArray[3] = symbols;

    randPasswordArray = randPasswordArray.fill(allChars, 4);
    return this.shuffleArray(
      randPasswordArray.map(function (x) {
        return x[Math.floor(Math.random() * x.length)];
      })
    ).join("");
  }

  shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  /**
   * On submit form
   */
  onSubmit() {
    if (this.resetForm.valid) {
      this.passworReset = new SetPassword();

      let pass = this.generatePassword(24);

      this.passworReset.Email = this.resetForm.value.email;
      this.passworReset.NewPassword = pass;
      this.passworReset.ConfirmPassword = pass;

      this.userService.setPassword(this.passworReset).subscribe(
        (res) => {
          let a: any = { email: String, message: String };

          a.email = this.passworReset.Email;
          a.message = "Your new password is " + this.passworReset.NewPassword;

          this.userService.sendEmail(a).subscribe((x) => {});

          Swal.fire(
            "Reset!",
            "An email has been sent to " +
              this.resetForm.value.email +
              " with the new password. Please log in using the new password and you can reset to an easily memorable password later.",
            "success"
          );
        },
        (err) => {
          Swal.fire(
            "Failed!",
            "An error occured while trying to reset your password. Please check whether the email",
            "error"
          );
          //console.log(err);
        }
      );

      // this.userService.setPassword(this.passworReset).subscribe(
      //   (x) => {
      //     Swal.fire(
      //       "Success!",
      //       "An email has been sent to " +
      //         this.resetForm.value.email +
      //         " with the new password. Please log in using the new password and you can reset to an easily memorable password later.",
      //       "success"
      //     );
      //   },
      //   (err) => {
      //     Swal.fire(
      //       "Failed!",
      //       "An error occured while trying to reset your password. Please check whether the email is correct",
      //       "error"
      //     );
      //   }
      // );
    }
    //   this.success = '';
    //   this.submitted = true;
    //   // stop here if form is invalid
    //   if (this.resetForm.invalid) {
    //     return;
    //   }
    //   if (environment.defaultauth === 'firebase') {
    //     this.authenticationService.resetPassword(this.f.email.value)
    //       .catch(error => {
    //         this.error = error ? error : '';
    //       });
    //   }
  }
}
