export class CustomBonusReportModel {
  columnName: string;
  currentTimeStamp: number;
}

export class BonusReportParams {
  bonusData: ParamsBonusReport;
  columnLists: CustomBonusReportModel[];
}

export class CustomBonusReportSelection {
  Id: string;
  Name: string;
  ReportSection: string;
  ReportTitle: string;
  Selection: string;
  Active: boolean;
  Tstamp: Date;
}

export class VBonusReport {
  Id: string;
  Year: number;
  Amount: number;
  Note: string;
  Type: string;
  PersonalDataId: number;
  Name: string;
  FileNo: string;
  CivilIdNo: string;
  DateBirth: Date;
  DateJoin: Date;
  PhoneNo: string;
  ArticleNo: number;
  MasterDepartmentId: number;
  MasterDepartment: string;
  Sector: string;
  Program: string;
  GenderId: number;
  Gender: string;
  ArabicDescription: string;
  PermanencyType: number;
  InsideBuilding: boolean;
  AdvHousing: boolean;
  AdvMobile: boolean;
  AdvVehicle: boolean;
  MasterFunctionalGroupId: number;
  MasterFunctionalGroup: string;
  MasterDesignationId: number;
  MasterDesignation: string;
  MasterJobTitleId: number;
  MasterJobTitle: string;
  MasterJobDescriptionId: number;
  MasterJobDescription: string;
  MasterNationalityId: number;
  MasterNationality: string;
  MasterJobDegreeId: number;
  MasterJobDegree: string;
  MasterBudgetTypeId: number;
  MasterBudgetType: string;
  MasterJobLevelId: number;
  MasterJobLevel: string;
  NextJobLevelId: number;
  NextJobLevel: string;
  NextJobLevelDate: Date;
  MasterGradeId: number;
  MasterGrade: string;
  CurrentGradeDate: Date;
  NextGradeId: number;
  NextGrade: string;
  NextGradeDate: Date;
  CurrentNoOfAllowances: number;
  NextNoOfAllowances: number;
  RevisedBy: string;
  DateRevised: Date;
  Notes: string;
  IsRetired: boolean;
  MasterReasonForRetirementId: number;
}

export class ParamsBonusReport {
  Id: string;
  YearFrom: number;
  YearTo: number;
  Amount: number;
  Note: string;
  Type: string;
  PersonalDataId: number;
  Name: string;
  FileNo: string;
  CivilIdNo: string;
  DateBirth: Date;
  DateJoin: Date;
  PhoneNo: string;
  ArticleNo: number;
  MasterDepartmentId: number;
  MasterDepartment: string;
  Sector: string;
  Program: string;
  GenderId: number;
  Gender: string;
  ArabicDescription: string;
  PermanencyType: number;
  InsideBuilding: boolean;
  AdvHousing: boolean;
  AdvMobile: boolean;
  AdvVehicle: boolean;
  MasterFunctionalGroupId: number;
  MasterFunctionalGroup: string;
  MasterDesignationId: number;
  MasterDesignation: string;
  MasterJobTitleId: number;
  MasterJobTitle: string;
  MasterJobDescriptionId: number;
  MasterJobDescription: string;
  MasterNationalityId: number;
  MasterNationality: string;
  MasterJobDegreeId: number;
  MasterJobDegree: string;
  MasterBudgetTypeId: number;
  MasterBudgetType: string;
  MasterJobLevelId: number;
  MasterJobLevel: string;
  NextJobLevelId: number;
  NextJobLevel: string;
  NextJobLevelDate: Date;
  MasterGradeId: number;
  MasterGrade: string;
  CurrentGradeDate: Date;
  NextGradeId: number;
  NextGrade: string;
  NextGradeDate: Date;
  CurrentNoOfAllowances: number;
  NextNoOfAllowances: number;
  RevisedBy: string;
  DateRevised: Date;
  Notes: string;
  IsRetired: boolean;
  MasterReasonForRetirementId: number;
}
