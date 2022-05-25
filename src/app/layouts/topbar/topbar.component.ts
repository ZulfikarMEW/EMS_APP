import { Component, OnInit, Output, EventEmitter, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { DOCUMENT } from "@angular/common";
// import { AuthfakeauthenticationService } from "../../core/services/authfake.service";
import { CookieService } from "ngx-cookie-service";
import { LanguageService } from "../../core/services/language.service";
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { SystemfunctionService } from "src/app/core/services/systemfunction.service";
import { BnNgIdleService } from "bn-ng-idle";
import { SystemSettings } from "src/app/core/models/SystemSettings";
import { SystemConfiguration } from "src/app/core/models/SystemConfiguration";

@Component({
  selector: "app-topbar",
  templateUrl: "./topbar.component.html",
  styleUrls: ["./topbar.component.scss"],
})

/**
 * Topbar component
 */
export class TopbarComponent implements OnInit {
  element;
  cookieValue;
  flagvalue;
  countryName;
  valueset;
  selectedLang;
  isRtlClass;
  currentUser;
  loggedUserName: string;
  systemSettings: SystemSettings = new SystemSettings();
  systemConfiguration: SystemConfiguration[] = [];
  _systemConfiguration: SystemConfiguration = new SystemConfiguration();
  //isRtl: boolean = false;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private router: Router,
    private authService: AuthenticationService,
    private systemFunction: SystemfunctionService,
    // private authFackservice: AuthfakeauthenticationService,
    public languageService: LanguageService,
    public translate: TranslateService,
    public _cookiesService: CookieService,
    private bnIdle: BnNgIdleService
  ) {}

  listLang = [
    { text: "English", flag: "assets/images/flags/us.jpg", lang: "en" },
    { text: "Arabic", flag: "assets/images/flags/kuwait.jpg", lang: "ar" },
    // { text: "Spanish", flag: "assets/images/flags/spain.jpg", lang: "es" },
    // { text: "German", flag: "assets/images/flags/germany.jpg", lang: "de" },
    // { text: "Italian", flag: "assets/images/flags/italy.jpg", lang: "it" },
    // { text: "Russian", flag: "assets/images/flags/russia.jpg", lang: "ru" },
  ];

  openMobileMenu: boolean;

  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  ngOnInit() {
    this.systemFunction.getSystemSettings().subscribe((x) => {
      Object.assign(this.systemConfiguration, x);

      this._systemConfiguration = this.systemConfiguration.filter(
        (x) => x.Name == "SessionTimeOut"
      )[0];

      this.bnIdle
        .startWatching(this._systemConfiguration.ValueFrom)
        .subscribe((isTimedOut: boolean) => {
          if (isTimedOut) {
            console.log("session expired");
            console.log(this._systemConfiguration.ValueFrom);
            this.bnIdle.stopTimer();
            this.logout();
          }
        });
    });

    this.systemFunction.currentUser.subscribe(
      (uid) => (this.currentUser = uid)
    );

    //console.log(this._cookiesService.get("currentUser"));

    this.loggedUserName = this._cookiesService.get("currentUser");

    this.openMobileMenu = false;
    this.element = document.documentElement;

    this.cookieValue = this._cookiesService.get("lang");
    const val = this.listLang.filter((x) => x.lang === this.cookieValue);
    this.countryName = val.map((element) => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.valueset = "assets/images/flags/us.jpg";
        this._cookiesService.set("lang", "en");
      }
    } else {
      this.flagvalue = val.map((element) => element.flag);
    }
  }

  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);

    this.selectedLang = lang;

    if (lang == "ar") {
      // document.body.classList.add("rtl");
      document.documentElement.className = "rtl";
      document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
    } else {
      // document.body.classList.remove("rtl");
      document.documentElement.className = "";

      document.getElementsByTagName("html")[0].setAttribute("dir", "ltr");
    }

    document.getElementsByTagName("html")[0].setAttribute("lang", lang);
  }

  get isRtl(): string {
    //console.log(this._cookiesService.get("lang"));

    if (this._cookiesService.get("lang") == "ar") {
      this.isRtlClass = "rtl-right-bar-toggle";
      return "rtl-right-bar-toggle";
    } else {
      this.isRtlClass = "right-bar-toggle";
      return "right-bar-toggle";
    }
  }
  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    // if (this._cookiesService.get("lang") == "ar") {
    //   this.isRtl = true;
    // } else {
    //   this.isRtl = false;
    // }

    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Logout the user
   */
  logout() {
    // if (environment.defaultauth === "firebase") {
    //   this.authService.logout();
    // } else {
    //   this.authFackservice.logout();
    // }
    this.authService.logout();

    this._cookiesService.deleteAll();

    this._cookiesService.deleteAll("/", "");

    this.router.navigate(["/account/login"]);
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle("fullscreen-enable");
    if (
      !document.fullscreenElement &&
      !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement
    ) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }
}
