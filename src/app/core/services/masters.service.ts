import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { MasterData } from "src/app/pages/masters/MasterData";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MastersService {
  apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  postMasterData(opt: number, data: MasterData): Observable<MasterData> {
    return this.http
      .post<MasterData>(
        this.apiUrl + "Master?opt=" + opt,
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  // postLeaveFilter(Param): Observable<VLeaveFilter> {
  //   return this.http
  //     .post<VLeaveFilter>(
  //       this.apiUrl + "Leave/LeaveFiltered",
  //       JSON.stringify(Param),
  //       this.httpOptions
  //     )
  //     .pipe(catchError(this.handleError));
  // }

  getMasterDataList(opt: number, id: number): Observable<MasterData> {
    return this.http.get<MasterData>(
      this.apiUrl + "Master?opt=" + opt + "&&id=" + id
    );
  }
}
