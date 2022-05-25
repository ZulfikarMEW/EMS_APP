export class VLeaveReport {
  Id: string;
  RequestedBy: string;
  RequestedFor: string;
  RequestTime: Date;
  Status: string;
  LeaveType: string;
  ApprovedBy: string;
  ApprovedTime: Date;
  RejectedBy: string;
  RejectedTime: Date;
  CanceledTime: Date;
  Comments: string;
  Year: number;
  LeaveStarted: Date;
  LeaveEnded: Date;
  ReturnedDate: Date;
  NoOfDays: number;
  DelayedDays: number;
  IsLocalVacation: boolean;
  IsPrivate: boolean;
  RequestedForId: string;
  FileNo: string;
  CivilId: string;
  HomePhone: string;
  OfficePhone: string;
  Mobile: string;
}
