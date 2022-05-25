import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Bonus } from "src/app/pages/bonus/Bonus";
import { BonusAdjustment } from "src/app/pages/bonus/bonusadjustment/BonusAdjustment";
import { VBonusList } from "src/app/pages/bonus/bonusadjustment/VBonusList";
import {
  CustomBonusReportSelection,
  ParamsBonusReport,
  VBonusReport,
} from "src/app/pages/bonus/custom-bonus-report/custom-bonus-report-model";
import { VBonusEligibleList } from "src/app/pages/bonus/manualentry/VBonusEligibleList";
import { BonusValidationErrors } from "src/app/pages/bonus/upload/BonusValidationErrors";
import { PersonalData } from "src/app/pages/personal/PersonalData";
import { environment } from "src/environments/environment";

class Post {
  constructor(public id: string, public title: string, public body: string) {}
}

@Injectable({
  providedIn: "root",
})
export class BonusService {
  apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  handleError(error: HttpErrorResponse) {
    console.log(error);
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  postGetReportData(data: ParamsBonusReport): Observable<VBonusReport> {
    return this.http
      .post<VBonusReport>(
        this.apiUrl + "Bonus/BonusReport",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  // NEED TO CHECK
  postGetBonusData(data: VBonusReport): Observable<VBonusReport> {
    return this.http
      .post<VBonusReport>(
        this.apiUrl + "Bonus",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  PostSaveSelection(
    data: CustomBonusReportSelection
  ): Observable<CustomBonusReportSelection> {
    return this.http
      .post<CustomBonusReportSelection>(
        this.apiUrl + "SystemFunction/SaveBonusSelection",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getSavedSelection() {
    return this.http.get<CustomBonusReportSelection>(
      this.apiUrl + "SystemFunction/GetBonusSelection"
    );
  }

  PostDeleteSelection(
    data: CustomBonusReportSelection
  ): Observable<CustomBonusReportSelection> {
    return this.http
      .post<CustomBonusReportSelection>(
        this.apiUrl + "SystemFunction/DeleteSelection",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  // handleError(error: HttpErrorResponse) {
  //   // console.log(error);
  //   // return throwError(error);
  //   if (error.error instanceof ErrorEvent) {
  //     console.error("Client Side Error: ", error.error.message);
  //   } else {
  //     console.error("Server Side Error: ", error);
  //   }

  //   return throwError(error);
  // }

  // postGetPersonalData(data: PersonalData): Observable<PersonalData> {
  //   return this.http
  //     .post<PersonalData>(
  //       this.apiUrl + "Personal",
  //       JSON.stringify(data),
  //       this.httpOptions
  //     )
  //     .pipe(catchError(this.handleError));
  // }

  // getLeaveTypeList(data): Observable<MasterData> {
  //   return this.http.get<MasterData>(
  //     this.apiUrl + "Master?opt=" + opt + "&&id=" + id
  //   );
  // }

  upload(file): Observable<Post[]> {
    // Create form data
    const formData = new FormData();

    // Store form name as "file" with file data
    formData.append("file", file, file.name);

    // Make http post request over api
    // with formData as req
    return this.http.post<Post[]>(this.apiUrl + "Bonus/Upload", formData);
  }

  postInsertData(data: any): Observable<any> {
    return this.http
      .post<any>(
        this.apiUrl + "Bonus/InsertTemData",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getvadidationErrors(): Observable<BonusValidationErrors> {
    return this.http.get<BonusValidationErrors>(
      this.apiUrl + "Bonus/Validation"
    );
  }

  getUpdateAnnualEvaluationData(): Observable<any> {
    return this.http.get<any>(this.apiUrl + "Bonus/UpdateAnnualEvaluationData");
  }

  getMasterMappingData(): Observable<any> {
    return this.http.get<any>(this.apiUrl + "Bonus/MasterMappingData");
  }

  getMappedData(): Observable<any> {
    return this.http.get<any>(this.apiUrl + "Bonus/MappedData");
  }

  removeMappedData(item): Observable<any> {
    return this.http.get<any>(this.apiUrl + "Bonus/RemoveMappedData/" + item);
  }

  addMappedData(item): Observable<any> {
    return this.http.post<any>(
      this.apiUrl + "Bonus/AddMappedData",
      JSON.stringify(item),
      this.httpOptions
    );
  }

  // postGetAdjustmentData(data: PersonalData): Observable<BonusAdjustment> {
  //   return this.http
  //     .post<BonusAdjustment>(
  //       this.apiUrl + "Bonus/Adjustment",
  //       JSON.stringify(data),
  //       this.httpOptions
  //     )
  //     .pipe(catchError(this.handleError));
  // }

  postGetBonusList(id: number): Observable<VBonusList> {
    return this.http
      .get<VBonusList>(this.apiUrl + "Bonus/BonusList?id=" + id)
      .pipe(catchError(this.handleError));
  }

  postRemoveBonusAdjustment(data: BonusAdjustment): Observable<any> {
    return this.http
      .post<any>(
        this.apiUrl + "Bonus/Adjustment/Remove",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postSaveAdjustment(data: BonusAdjustment): Observable<BonusAdjustment> {
    return this.http
      .post<BonusAdjustment>(
        this.apiUrl + "Bonus/Adjustment",
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getBonusEligibleList(year: number): Observable<VBonusEligibleList> {
    return this.http
      .get<VBonusEligibleList>(
        this.apiUrl + "Bonus/EligibilityList?year=" + year
      )
      .pipe(catchError(this.handleError));
  }

  postSaveBonus(data: Bonus[]): Observable<any> {
    return this.http
      .post<any>(this.apiUrl + "Bonus", JSON.stringify(data), this.httpOptions)
      .pipe(catchError(this.handleError));
  }
}
