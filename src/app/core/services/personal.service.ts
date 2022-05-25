import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { PersonalQualification } from "src/app/pages/personal/addqualification/PersonalQualification";
import { VPersonalQualification } from "src/app/pages/personal/addqualification/VPersonalQualification";
import { PersonalChangeJobTitle } from "src/app/pages/personal/change-job-title/PersonalChangeJobTitle";
import { VPersonalChangeJobTitle } from "src/app/pages/personal/change-job-title/VPersonalChangeJobTitle";
import { CustomReportSelection } from "src/app/pages/personal/custom-report/custom-report-model";
import { VPersonalDataSearch } from "src/app/pages/personal/personal-data/VPersonalDataSearch";
import { PersonalAnnualEvaluation } from "src/app/pages/personal/personal-evaluation/PersonalAnnualEvaluation";
import { VPersonalAnnualEvaluation } from "src/app/pages/personal/personal-evaluation/VPersonalAnnualEvaluation";
import { PersonalData } from "src/app/pages/personal/PersonalData";
import { PersonalPriorExperience } from "src/app/pages/personal/previos-experience/PersonalPriorExperience";
import { VPersonalPriorExperience } from "src/app/pages/personal/previos-experience/VPersonalPriorExperience";
import { PersonalPromotion } from "src/app/pages/personal/promotion/PersonalPromotion";
import { VPersonalPromotion } from "src/app/pages/personal/promotion/VPersonalPromotion";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class PersonalService {
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

  postGetPersonalData(data: PersonalData): Observable<PersonalData> {
    return this.http
      .post<PersonalData>(
        this.apiUrl + "Personal",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postGetReportData(data: PersonalData): Observable<VPersonalDataSearch> {
    return this.http
      .post<VPersonalDataSearch>(
        this.apiUrl + "Personal/CustomReport",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postSavePersonalData(data: PersonalData): Observable<PersonalData> {
    return this.http
      .post<PersonalData>(
        this.apiUrl + "Personal/Save",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  PostSaveSelection(
    data: CustomReportSelection
  ): Observable<CustomReportSelection> {
    return this.http
      .post<CustomReportSelection>(
        this.apiUrl + "SystemFunction/SaveSelection",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  PostDeleteSelection(
    data: CustomReportSelection
  ): Observable<CustomReportSelection> {
    return this.http
      .post<CustomReportSelection>(
        this.apiUrl + "SystemFunction/DeleteSelection",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getSavedSelection() {
    return this.http.get<CustomReportSelection>(
      this.apiUrl + "SystemFunction/GetSelection"
    );
  }

  postGetPersonalQualification(
    data: PersonalData
  ): Observable<VPersonalQualification> {
    return this.http
      .post<VPersonalQualification>(
        this.apiUrl + "Personal/Qualification",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postSavePersonalQualification(
    data: PersonalQualification
  ): Observable<VPersonalQualification> {
    return this.http
      .post<VPersonalQualification>(
        this.apiUrl + "Personal/Qualification/Save",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postRemovePersonalQualification(
    data: VPersonalQualification
  ): Observable<any> {
    return this.http
      .post<any>(
        this.apiUrl + "Personal/Qualification/Remove",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postGetPersonalExperience(
    data: PersonalData
  ): Observable<VPersonalPriorExperience> {
    return this.http
      .post<VPersonalPriorExperience>(
        this.apiUrl + "Personal/Experience",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postSavePersonalExperience(
    data: PersonalPriorExperience
  ): Observable<VPersonalPriorExperience> {
    return this.http
      .post<VPersonalPriorExperience>(
        this.apiUrl + "Personal/Experience/Save",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postRemovePersonalExperience(
    data: VPersonalPriorExperience
  ): Observable<any> {
    return this.http
      .post<any>(
        this.apiUrl + "Personal/Experience/Remove",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postGetPersonalPromotion(data: PersonalData): Observable<VPersonalPromotion> {
    return this.http
      .post<VPersonalPromotion>(
        this.apiUrl + "Personal/Promotion",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postSavePersonalPromotion(
    data: PersonalPromotion
  ): Observable<VPersonalPromotion> {
    return this.http
      .post<VPersonalPromotion>(
        this.apiUrl + "Personal/Promotion/Save",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postRemovePersonalPromotion(data: VPersonalPromotion): Observable<any> {
    return this.http
      .post<any>(
        this.apiUrl + "Personal/Promotion/Remove",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postGetMasterJobTitleList(
    data: PersonalData
  ): Observable<VPersonalChangeJobTitle> {
    return this.http
      .post<VPersonalChangeJobTitle>(
        this.apiUrl + "Personal/MasterJobTitle",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postGetPersonalJobTitle(
    data: PersonalData
  ): Observable<VPersonalChangeJobTitle> {
    return this.http
      .post<VPersonalChangeJobTitle>(
        this.apiUrl + "Personal/JobTitle",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postSavePersonalJobTitle(
    data: PersonalChangeJobTitle
  ): Observable<VPersonalChangeJobTitle> {
    return this.http
      .post<VPersonalChangeJobTitle>(
        this.apiUrl + "Personal/JobTitle/Save",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postRemovePersonalJobTitle(data: VPersonalChangeJobTitle): Observable<any> {
    return this.http
      .post<any>(
        this.apiUrl + "Personal/JobTitle/Remove",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postSavePersonalEvaluation(data: PersonalAnnualEvaluation) {
    return this.http
      .post<any>(
        this.apiUrl + "Personal/Evaluation/Save",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postRemovePersonalEvaluation(data: PersonalAnnualEvaluation) {
    return this.http
      .post<any>(
        this.apiUrl + "Personal/Evaluation/Remove",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postGetPersonalAnnualEvaluation(
    data: PersonalData
  ): Observable<VPersonalAnnualEvaluation> {
    return this.http
      .post<VPersonalAnnualEvaluation>(
        this.apiUrl + "Personal/Evaluation",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  // getLeaveTypeList(data): Observable<MasterData> {
  //   return this.http.get<MasterData>(
  //     this.apiUrl + "Master?opt=" + opt + "&&id=" + id
  //   );
  // }
}
