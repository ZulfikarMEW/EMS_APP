import { PersonalData } from "../PersonalData";

export class CustomReportModel {
  columnName: string;
  currentTimeStamp: number;
}

export class ReportParams {
  personalData: PersonalData;
  columnLists: CustomReportModel[];
}

export class CustomReportSelection {
  Id: string;
  Name: string;
  ReportSection: string;
  ReportTitle: string;
  Selection: string;
  Active: boolean;
  Tstamp: Date;
}
