export class UserProfile {
  Id: string;
  FileNo: string;
  CivilId: string;
  Name: string;
  UserName: string;
  Email: string;
  Mobile: string;
  HomePhone: string;
  OfficePhone: string;
  Description: string;
  Address: string;
  // SystemCountryId: number;
  // SystemDepartmentId: number;
  SystemRoleId: number;
  GenderId: number;
  SystemLanguageId: number;
  DateOfBirth: Date;
  DateOfJoin: Date;
  Active: boolean;
  IsLockedOut: boolean;
  IsSuperUser: boolean;
  Tstamp: Date;
  Password: string;
  ConfirmPassword: string;
}
