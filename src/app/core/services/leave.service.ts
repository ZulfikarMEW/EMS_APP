import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { LeaveLeaveTypeDto } from "src/app/pages/approval/leavereport/LeaveLeaveTypeDto";
import { VLeaveReport } from "src/app/pages/approval/leavereport/VLeaveReport";
import { LeaveChart } from "src/app/pages/dashboards/default/LeaveChart";
import { UpdateRequestModel } from "src/app/pages/Request/UpdateRequestModel";
import { environment } from "src/environments/environment";
import { Leave } from "../models/leave";
import { LeaveBalance } from "../models/LeaveBalance";
import { LeaveBalanceDto } from "../models/LeaveBalanceDto";
import { LeaveReportData } from "../models/LeaveReportData";
import { VLeaveFilter } from "../models/VLeaveFilter";
import { VLeaveHeader } from "../models/VLeaveHeader";

@Injectable({
  providedIn: "root",
})
export class LeaveService {
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

  postLeaveFilter(Param): Observable<VLeaveFilter> {
    return this.http
      .post<VLeaveFilter>(
        this.apiUrl + "Leave/LeaveFiltered",
        JSON.stringify(Param),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postLeaveHeader(Param): Observable<VLeaveHeader> {
    return this.http.post<VLeaveHeader>(
      this.apiUrl + "Leave/LeaveHeader",
      JSON.stringify(Param),
      this.httpOptions
    );
  }

  postLeaveBalance(Param): Observable<LeaveBalanceDto> {
    return this.http
      .post<LeaveBalanceDto>(
        this.apiUrl + "Leave/LeaveBalance",
        JSON.stringify(Param),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postUpdateLeaveBalance(Param): Observable<LeaveBalance> {
    return this.http
      .post<LeaveBalance>(
        this.apiUrl + "Leave/UpdateLeaveBalance",
        JSON.stringify(Param),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postLeaveReport(Param: LeaveReportData): Observable<VLeaveReport> {
    return this.http
      .post<VLeaveReport>(
        this.apiUrl + "Leave/LeaveReport",
        JSON.stringify(Param),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postLeave(leave: Leave): Observable<VLeaveFilter> {
    return this.http
      .post<VLeaveFilter>(
        this.apiUrl + "Leave",
        JSON.stringify(leave),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postChangeRequestStatus(leave: UpdateRequestModel): Observable<VLeaveFilter> {
    return this.http
      .post<VLeaveFilter>(
        this.apiUrl + "Leave/UpdateRequestStatus",
        JSON.stringify(leave),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postLeaveReturnFilter(Param): Observable<VLeaveFilter> {
    return this.http
      .post<VLeaveFilter>(
        this.apiUrl + "Leave/LeaveReturnFiltered",
        JSON.stringify(Param),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  // getEmployeeList(): Observable<LeaveEmployeeDto> {
  //   return this.http.get<LeaveEmployeeDto>(
  //     this.apiUrl + "Leave/LeaveEmployeeFilter"
  //   );
  // }

  getLeaveTypeList(): Observable<LeaveLeaveTypeDto> {
    return this.http.get<LeaveLeaveTypeDto>(
      this.apiUrl + "Leave/LeaveLeaveTypeFilter"
    );
  }

  postLeaveChart(Param): Observable<LeaveChart> {
    return this.http
      .post<LeaveChart>(
        this.apiUrl + "Leave/LeaveChartData",
        JSON.stringify(Param),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
}
