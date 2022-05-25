export class Leave {
  Id: string;
  RequestedBy: string;
  RequestedFor: string;
  RequestTime: Date;
  Status: string;
  LeaveTypeId: number;
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
  IsLocalVacation: boolean;
  IsPrivate: boolean;
}
