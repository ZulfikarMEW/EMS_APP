import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { SystemUserFilterParams } from "src/app/pages/employee/SystemUserFilterParams";
import { environment } from "src/environments/environment";

import { SystemGender } from "../models/SystemGender";
import { SystemLanguage } from "../models/SystemLanguage";
import { SystemSettings } from "../models/SystemSettings";
import { UserProfile } from "../models/userProfile.models";

@Injectable({
  providedIn: "root",
})
export class SystemfunctionService {
  apiUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    public _cookiesService: CookieService
  ) {}

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  private userSource = new BehaviorSubject(UserProfile);
  currentUser = this.userSource.asObservable();

  private employeeFilterSource = new BehaviorSubject(SystemUserFilterParams);
  currentEmployeeFilter = this.employeeFilterSource.asObservable();

  changeUser(user) {
    this.userSource.next(user);
    if (user != null) {
      this._cookiesService.set("currentUser", user.Name);
      this._cookiesService.set("user", JSON.stringify(user));
    }
    ////console.log(user);
  }

  changeEmployeeFilter(employee) {
    this.employeeFilterSource.next(employee);
    // //console.log(employee);
  }

  getSystemGenderList() {
    return this.http.get<SystemGender>(this.apiUrl + "SystemFunction/Gender");
  }

  getSystemSettings(): Observable<SystemSettings> {
    return this.http.get<SystemSettings>(
      this.apiUrl + "SystemFunction/SystemSettings"
    );
  }

  // getSystemCountryList() {
  //   return this.http.get<SystemCountry>(this.apiUrl + "SystemFunction/Country");
  // }

  // getSystemDepartmentList() {
  //   return this.http.get<SystemDepartment>(
  //     this.apiUrl + "SystemFunction/Department"
  //   );
  // }

  getSystemLanguageList() {
    return this.http.get<SystemLanguage>(
      this.apiUrl + "SystemFunction/Language"
    );
  }

  private _columList: BehaviorSubject<any> = new BehaviorSubject(null);

  /**
   * Getter for version data
   */
  get columList$(): Observable<any> {
    return this._columList.asObservable();
  }

  getColumnsList(
    tbl: string
  ): Observable<{ Column_Id: string; Name: string }[]> {
    return this.http
      .get(this.apiUrl + "SystemFunction/GetColumnNames?tblName=" + tbl)
      .pipe(
        tap((response: any) => {
          this._columList.next(response);
        })
      );
  }
}
