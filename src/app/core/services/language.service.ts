import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";

@Injectable({ providedIn: "root" })
export class LanguageService {
  public languages: string[] = ["en", "ar", "es", "de", "it", "ru"];

  constructor(
    public translate: TranslateService,
    private cookieService: CookieService
  ) {
    let browserLang;
    this.translate.addLangs(this.languages);
    if (this.cookieService.check("lang")) {
      browserLang = this.cookieService.get("lang");
    } else {
      this.setLanguage("en");
      browserLang = translate.getBrowserLang();
    }

    if (browserLang == "ar") {
      // document.body.classList.add("rtl");
      document.documentElement.className = "rtl";
      document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
    } else {
      // document.body.classList.remove("rtl");
      document.documentElement.className = "";

      document.getElementsByTagName("html")[0].setAttribute("dir", "ltr");
    }

    translate.use(browserLang.match(/en|ar|es|de|it|ru/) ? browserLang : "en");
  }

  public setLanguage(lang) {
    this.translate.use(lang);
    this.cookieService.set("lang", lang);
  }
}
