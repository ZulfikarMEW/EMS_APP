import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CookieService } from "ngx-cookie-service";
import { Leave } from "src/app/core/models/leave";
import { LeaveBalanceDto } from "src/app/core/models/LeaveBalanceDto";
import { LeaveFilterParams } from "src/app/core/models/leaveFilterParams";
import { RoleFunction } from "src/app/core/models/RoleFunction";
import { UserProfile } from "src/app/core/models/userProfile.models";
import { VLeaveFilter } from "src/app/core/models/VLeaveFilter";
import { VLeaveHeader } from "src/app/core/models/VLeaveHeader";
import { LeaveService } from "src/app/core/services/leave.service";
import { UserProfileService } from "src/app/core/services/user.service";
import Swal from "sweetalert2";
import { SystemUserFilterParams } from "../../employee/SystemUserFilterParams";
import { UpdateRequestModel } from "../../Request/UpdateRequestModel";

@Component({
  selector: "app-leave-return",
  templateUrl: "./leave-return.component.html",
  styleUrls: ["./leave-return.component.scss"],
})
export class LeaveReturnComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  leaveData: VLeaveFilter[] = [];

  leaveForm: FormGroup;
  userLeaveHeader: VLeaveHeader = new VLeaveHeader();
  userLeaveBalance: LeaveBalanceDto[] = [];

  currentUser;
  statData: { icon: string; title: string; value: number }[];

  leaveParams: LeaveFilterParams = new LeaveFilterParams();
  modalTitle: string;
  editMode: boolean = false;
  employeeParams: SystemUserFilterParams = new SystemUserFilterParams();
  employeeList: UserProfile[] = [];
  selectedEmployee: UserProfile = new UserProfile();
  leaveFormSubmit: boolean;

  userAccess: RoleFunction[] = [];
  hasViewAccess: boolean = false;
  hasAddAccess: boolean = false;
  hasEditAccess: boolean = false;
  hasDeleteAccess: boolean = false;
  userAccessFiltered: RoleFunction = new RoleFunction();

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private leaveService: LeaveService,
    public _cookiesService: CookieService,
    private userService: UserProfileService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Request" },
      { label: "Leave Return", active: true },
    ];

    this.userService.getUserRoleFunction().subscribe((res: any) => {
      Object.assign(this.userAccess, res.RoleFunctions);

      this.userAccessFiltered = this.userAccess.find(
        (t) => t.SystemRoleFunctionId == 5
      );

      if (this.userAccessFiltered != null) {
        this.hasViewAccess = this.userAccessFiltered.AllowView;
        this.hasAddAccess = this.userAccessFiltered.AllowAdd;
        this.hasEditAccess = this.userAccessFiltered.AllowEdit;
        this.hasDeleteAccess = this.userAccessFiltered.AllowDelete;
      }
    });

    this.leaveForm = this.fb.group({
      Id: [""],
      LeaveTypeId: ["", [Validators.required]],
      LeaveStarted: ["", [Validators.required]],
      LeaveEnded: ["", [Validators.required]],
      ReturnedDate: [""],
      RequestedFor: [""],
      IsLocalVacation: false,
    });

    this.currentUser = JSON.parse(this._cookiesService.get("user"));

    this.fetchData();
  }

  fetchData() {
    this.statData = [];

    //this.leaveParams.UserId = this.currentUser.Id;
    //this.leaveParams.Status = "N";
    this.leaveParams.Year = new Date().getFullYear();

    this.selectedEmployee = this.currentUser;

    this.leaveService.postLeaveReturnFilter(this.leaveParams).subscribe((x) => {
      Object.assign(this.leaveData, x);
    });

    // this.leaveService.postLeaveBalance(this.leaveParams).subscribe((x) => {
    //   Object.assign(this.userLeaveBalance, x);
    //   //console.log(this.userLeaveBalance);
    // });

    // this.leaveService.postLeaveHeader(this.leaveParams).subscribe((x) => {
    //   Object.assign(this.userLeaveHeader, x);
    //   //console.log(this.userLeaveHeader);

    //   this.statData = [
    //     {
    //       icon: "bx bx-check-circle",
    //       title: "Leave Taken",
    //       value: this.userLeaveHeader.TakenLeaves,
    //     },
    //     {
    //       icon: "bx bx-hourglass",
    //       title: "Pending Request",
    //       value: this.userLeaveHeader.PendingRequests,
    //     },
    //     {
    //       icon: "bx bx-add-to-queue",
    //       title: "Extra Taken Leaves",
    //       value: this.userLeaveHeader.DelayedDays,
    //     },
    //   ];
    // });
  }

  get f() {
    return this.leaveForm.controls;
  }

  onSubmit() {
    if (this.hasAddAccess) {
      //console.log(this.leaveForm);

      // this.leaveFormSubmit = true;

      // if (this.leaveForm.valid) {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to update the return date?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Yes, save it!",
      }).then((result) => {
        if (result.value) {
          let u = new Leave();

          u.Id = this.leaveForm.get("Id").value;
          u.ReturnedDate = this.leaveForm.get("ReturnedDate").value;

          this.leaveService.postLeave(u).subscribe(
            (res) => {
              Swal.fire("Saved!", "Return date has been saved.", "success");

              const Idx = this.leaveData.map((item) => item.Id).indexOf(u.Id);
              this.leaveData.splice(Idx, 1);

              ////console.log(res);

              // if (!this.editMode) {
              //   this.leaveData.push(res);
              // } else {
              //   const Idx = this.leaveData
              //     .map((item) => item.Id)
              //     .indexOf(res.Id);
              //   this.leaveData[Idx] = res;
              // }

              // this.leaveData.sort((a, b) => {
              //   return (
              //     <any>new Date(b.RequestTime) - <any>new Date(a.RequestTime)
              //   );
              // });

              this.modalService.dismissAll();
              this.leaveFormSubmit = false;
              this.editMode = false;
            },
            (err) => {
              Swal.fire(
                "Failed!",
                "Something went wrong. Please check your data",
                "error"
              );
              //console.log(err);
            }
          );
        }
      });
      // } else {
      //   Swal.fire(
      //     "Failed!",
      //     "Something went wrong. Please check your data",
      //     "error"
      //   );
      // }
    } else {
      Swal.fire(
        "Access Denied!",
        "You do not have access to perform this action",
        "error"
      );
    }
  }
  empFormSubmit() {}

  editBalanceValue: boolean = false;

  editBalance(): boolean {
    this.editBalanceValue = !this.editBalanceValue;
    return this.editBalanceValue;
  }

  updateBalance(): boolean {
    this.editBalanceValue = !this.editBalanceValue;
    return this.editBalanceValue;
  }

  statusClass(str): string {
    if (str == "Approved") {
      return "badge rounded-pill bg-success ms-1";
    }
    if (str == "Canceled") {
      return "badge rounded-pill bg-dark ms-1";
    }
    if (str == "Pending") {
      return "badge rounded-pill bg-warning ms-1";
    }
    if (str == "Rejected") {
      return "badge rounded-pill bg-danger ms-1";
    }
  }

  async cancelRequest(req: VLeaveFilter) {
    // const ipAPI = "//api.ipify.org?format=json";
    // const inputValue = fetch(ipAPI)
    //   .then((response) => response.json())
    //   .then((data) => data.ip);

    const { value: comment } = await Swal.fire({
      title: "Please enter your comments for rejection",
      input: "text",
      inputLabel: "Comment",
      inputValue: "", //inputValue,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });

    if (comment) {
      let s = new UpdateRequestModel();

      s.Id = req.Id;
      s.Status = "R";
      s.Comments = comment;

      this.leaveService.postChangeRequestStatus(s).subscribe(
        (x) => {
          const Idx = this.leaveData.map((item) => item.Id).indexOf(req.Id);
          this.leaveData.splice(Idx, 1);
          Swal.fire("Canceled!", "This request has been canceled.", "success");
        },
        (err) => {
          Swal.fire("Failed!", "Server returned with message " + err, "error");
        }
      );
    }
  }

  approveRequest(req: VLeaveFilter) {
    // Swal.fire({
    //   title: "<strong>HTML <u>example</u></strong>",
    //   icon: "info",
    //   html:
    //     '<form autocomplete="off" class="form-horizontal" [formGroup]="leaveForm" (ngSubmit)="onSubmit()">' +
    //     '<div class="col-sm-3">' +
    //     '<label for="example-datef-input">Date From</label>' +
    //     "<input" +
    //     'class="form-control"' +
    //     'type="date"' +
    //     'id="example-datef-input"' +
    //     'formControlName="LeaveStarted"' +
    //     "/>" +
    //     "</div>" +
    //     "</form>",
    //   showCloseButton: true,
    //   showCancelButton: true,
    //   focusConfirm: false,
    //   confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!',
    //   confirmButtonAriaLabel: "Thumbs up, great!",
    //   cancelButtonText: '<i class="fa fa-thumbs-down"></i>',
    //   cancelButtonAriaLabel: "Thumbs down",
    // }).then(function (result) {
    //   //console.log(this.leaveForm);
    // });
    // Swal.fire({
    //   title: "Date picker",
    //   html: '<input id="datepicker">',
    //   showConfirmButton: false,
    //   customClass: "swal2-overflow",
    //   onOpen: function () {
    //     $("#datepicker").datetimepicker({});
    //   },
    // }).then(function (result) {});
    // Swal.fire({
    //   title: "Are you sure?",
    //   text: "You want to approve this request?",
    //   icon: "question",
    //   showCancelButton: true,
    //   confirmButtonColor: "#34c38f",
    //   cancelButtonColor: "#f46a6a",
    //   confirmButtonText: "Yes, approve it!",
    // }).then((result) => {
    //   if (result.value) {
    //     let s = new UpdateRequestModel();
    //     s.Id = req.Id;
    //     s.Status = "A";
    //     s.Comments = null;
    //     this.leaveService.postChangeRequestStatus(s).subscribe(
    //       (x) => {
    //         const Idx = this.leaveData.map((item) => item.Id).indexOf(req.Id);
    //         this.leaveData.splice(Idx, 1);
    //         Swal.fire(
    //           "Approved!",
    //           "This request has been Approved.",
    //           "success"
    //         );
    //       },
    //       (err) => {
    //         Swal.fire(
    //           "Failed!",
    //           "Server returned with message " + err,
    //           "error"
    //         );
    //       }
    //     );
    //   }
    // });
  }

  openModal(newDataModal: any, leave: VLeaveFilter) {
    this.leaveForm.reset();

    this.leaveForm.controls.Id.setValue(leave.Id);
    // this.leaveForm.controls.ReturnedDate.setValue(
    //   this.datePipe.transform(timestamp, "fullDate")
    // );

    this.modalService.open(newDataModal, { centered: false });

    // let timestamp =
    //   leave.LeaveEnded != null
    //     ? new Date(
    //         new Date(leave.LeaveEnded).getFullYear(),
    //         new Date(leave.LeaveEnded).getMonth(),
    //         new Date(leave.LeaveEnded).getDate()
    //       )
    //     : new Date().getTime();

    // $("#datepicker").datepicker(
    //   "setDate",
    //   new Date(
    //     new Date(leave.LeaveEnded).getFullYear(),
    //     new Date(leave.LeaveEnded).getMonth(),
    //     new Date(leave.LeaveEnded).getDate()
    //   )
    // );

    // $(".datepicker").datepicker(
    //   "update",
    //   new Date(
    //     new Date(leave.LeaveEnded).getFullYear(),
    //     new Date(leave.LeaveEnded).getMonth(),
    //     new Date(leave.LeaveEnded).getDate()
    //   )
    // );
    // $("#dpStartDate").data({
    //   date:
    //     new Date(leave.LeaveEnded).getFullYear() +
    //     "-" +
    //     new Date(leave.LeaveEnded).getMonth() +
    //     "-" +
    //     new Date(leave.LeaveEnded).getDate(),
    // });
  }

  openEditModal(editDataModal: any, emp: Leave) {
    this.modalTitle = "Edit";

    this.leaveForm.controls.Id.setValue(emp.Id);
    this.leaveForm.controls.LeaveTypeId.setValue(emp.LeaveTypeId);
    this.leaveForm.controls.LeaveStarted.setValue(emp.LeaveStarted);
    this.leaveForm.controls.LeaveEnded.setValue(emp.LeaveEnded);
    this.leaveForm.controls.IsLocalVacation.setValue(emp.IsLocalVacation);

    this.editMode = true;

    this.modalService.open(editDataModal, { size: "lg", centered: false });
  }
}
