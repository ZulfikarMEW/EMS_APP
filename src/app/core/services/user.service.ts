import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { User } from "../models/auth.models";
import { UserProfile } from "../models/userProfile.models";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { ResetPassword } from "../models/resetPassword";
import { SystemRole } from "../models/SystemRole";
import { SystemRoleFunction } from "../models/SystemRoleFunction";

@Injectable({ providedIn: "root" })
export class UserProfileService {
  apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  getAll() {
    return this.http.get<User[]>(`/api/login`);
  }

  register(user: User) {
    return this.http.post(`/users/register`, user);
  }

  //   getUserProfile(): Observable<UserProfile> {
  //     localStorage.setItem("path", this.apiUrl + "SystemUser/CurrentUser");
  //     return this.http.get<UserProfile>(this.apiUrl + "SystemUser/CurrentUser");
  //   }

  getUserProfile() {
    return this.http.get<UserProfile>(this.apiUrl + "SystemUser/CurrentUser");
  }

  getUserProfile1(id) {
    return this.http.get<UserProfile>(this.apiUrl + "SystemUser/" + id);
  }

  getUsersList(userParam): Observable<UserProfile> {
    return this.http.post<UserProfile>(
      this.apiUrl + "SystemUser/UsersListFiltered",
      JSON.stringify(userParam),
      this.httpOptions
    );
  }

  postUser(userParam): Observable<UserProfile> {
    return this.http.post<UserProfile>(
      this.apiUrl + "Account/Register",
      JSON.stringify(userParam),
      this.httpOptions
    );
  }

  updateUser(userParam): Observable<UserProfile> {
    return this.http.post<UserProfile>(
      this.apiUrl + "Account/UpdateUser",
      JSON.stringify(userParam),
      this.httpOptions
    );
  }

  getRoles() {
    return this.http.get<SystemRole>(this.apiUrl + "Role");
  }

  getRoleFunction() {
    return this.http.get<SystemRole>(this.apiUrl + "Role/RoleFunction");
  }

  postRole(u: SystemRole) {
    return this.http.post<SystemRole>(
      this.apiUrl + "Role",
      JSON.stringify(u),
      this.httpOptions
    );
  }

  getUserRoleFunction() {
    return this.http.get<SystemRole>(this.apiUrl + "Role/UserRoleFunction");
  }

  resetPassword(userParam): Observable<ResetPassword> {
    return this.http.post<ResetPassword>(
      this.apiUrl + "Account/ResetPassword",
      JSON.stringify(userParam),
      this.httpOptions
    );
  }

  setPassword(userParam): Observable<ResetPassword> {
    return this.http.post<ResetPassword>(
      this.apiUrl + "Security/ResetPassword",
      JSON.stringify(userParam),
      this.httpOptions
    );
  }

  sendEmail(email) {
    return this.http.post(
      "https://formspree.io/f/mgedvyrn",
      JSON.stringify(email),
      this.httpOptions
    );
  }
}
