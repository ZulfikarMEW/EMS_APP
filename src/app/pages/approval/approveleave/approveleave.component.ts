import { HttpErrorResponse } from "@angular/common/http";
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
import { SystemfunctionService } from "src/app/core/services/systemfunction.service";
import { UserProfileService } from "src/app/core/services/user.service";
import Swal from "sweetalert2";
import { SystemUserFilterParams } from "../../employee/SystemUserFilterParams";
import { UpdateRequestModel } from "../../Request/UpdateRequestModel";

@Component({
  selector: "app-approveleave",
  templateUrl: "./approveleave.component.html",
  styleUrls: ["./approveleave.component.scss"],
})
export class ApproveleaveComponent implements OnInit {
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
  selectedLeave: VLeaveFilter = new VLeaveFilter();
  selectedNoOfDays: number;
  loading: boolean = false;

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
    private systemFunction: SystemfunctionService,
    private userService: UserProfileService,
    public _cookiesService: CookieService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Approval" },
      { label: "Leave Requests", active: true },
    ];

    this.userService.getUserRoleFunction().subscribe((res: any) => {
      Object.assign(this.userAccess, res.RoleFunctions);

      this.userAccessFiltered = this.userAccess.find(
        (t) => t.SystemRoleFunctionId == 6
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

    this.loading = true;

    this.currentUser = JSON.parse(this._cookiesService.get("user"));

    this.leaveParams.Status = "N";
    this.leaveParams.Year = new Date().getFullYear();

    //this.selectedEmployee = this.currentUser;

    this.leaveService.postLeaveFilter(this.leaveParams).subscribe((x) => {
      Object.assign(this.leaveData, x);
    });

    this.employeeList = [];
    this.userService.getUsersList(this.employeeParams).subscribe((x) => {
      Object.assign(this.employeeList, x);
      this.employeeList.sort((a, b) => a.Name.localeCompare(b.Name));
      this.loading = false;
    });
  }

  onChangeEmployee(empId) {
    this.selectedEmployee = this.employeeList.find((t) => t.Id == empId);

    this.leaveParams.UserId = empId;
    this.leaveParams.Status = null;
    this.leaveParams.Year = new Date().getFullYear();

    this.leaveForm.controls.RequestedFor.setValue(empId);

    this.fetchData();
  }

  fetchData() {
    this.statData = [];

    // this.leaveService.postLeaveFilter(this.leaveParams).subscribe((x) => {
    //   Object.assign(this.leaveData, x);
    // });

    // this.leaveService.postLeaveFilter(this.leaveParams).subscribe((x) => {
    //   Object.assign(this.userLeaveList, x);
    // });

    this.leaveService.postLeaveBalance(this.leaveParams).subscribe((x) => {
      Object.assign(this.userLeaveBalance, x);
      //console.log(this.userLeaveBalance);
    });

    this.leaveService.postLeaveHeader(this.leaveParams).subscribe((x) => {
      Object.assign(this.userLeaveHeader, x);
      //console.log(this.userLeaveHeader);

      this.statData = [
        {
          icon: "bx bx-check-circle",
          title: "Leave Taken",
          value: this.userLeaveHeader.TakenLeaves,
        },
        {
          icon: "bx bx-hourglass",
          title: "Pending Request",
          value: this.userLeaveHeader.PendingRequests,
        },
        {
          icon: "bx bx-add-to-queue",
          title: "Extra Taken Leaves",
          value: this.userLeaveHeader.DelayedDays,
        },
      ];
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

  openProfileModal(profileDataModal: any, leave: VLeaveFilter) {
    this.editMode = false;

    this.selectedLeave = leave;
    this.selectedNoOfDays = Math.floor(
      (Date.UTC(
        new Date(leave.LeaveEnded).getFullYear(),
        new Date(leave.LeaveEnded).getMonth(),
        new Date(leave.LeaveEnded).getDate()
      ) -
        Date.UTC(
          new Date(leave.LeaveStarted).getFullYear(),
          new Date(leave.LeaveStarted).getMonth(),
          new Date(leave.LeaveStarted).getDate()
        )) /
        (1000 * 60 * 60 * 24) +
        1
    );

    // this.employeeForm.reset();
    this.modalTitle = "Profile - " + leave.RequestedFor;

    // this.userLeaveList = [];
    // this.userLeaveHeader = new VLeaveHeader();
    // this.statData = [];

    // this.leaveParams = new LeaveFilterParams();
    //this.leaveParams.UserId = this.currentUser.Id;
    this.leaveParams.Status = null;

    // this.selectedEmployee = emp;

    this.leaveParams.UserId = leave.RequestedForId;
    this.leaveParams.Year = new Date().getFullYear();

    this.fetchData();

    this.userService.getUserProfile1(leave.RequestedForId).subscribe((x) => {
      Object.assign(this.selectedEmployee, x);
    });

    this.modalService.open(profileDataModal, { size: "xl", centered: false });
    // this.modalService.open(newDataModal);
  }
  // get f() {
  //   return this.leaveForm.controls;
  // }

  onSubmit() {
    if (this.hasAddAccess) {
      this.leaveFormSubmit = true;

      if (this.leaveForm.valid) {
        Swal.fire({
          title: "Are you sure?",
          text: "You want to approve this leave?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Yes, approve it!",
        }).then((result) => {
          if (result.value) {
            let u = new Leave();

            u.Id = this.leaveForm.get("Id").value;
            u.LeaveTypeId = this.leaveForm.get("LeaveTypeId").value;
            u.LeaveStarted = this.leaveForm.get("LeaveStarted").value;
            u.LeaveEnded = this.leaveForm.get("LeaveEnded").value;
            u.Status = "A";
            u.ReturnedDate = null; //this.leaveForm.get("ReturnedDate").value;
            if (this.leaveForm.get("IsLocalVacation").value != null) {
              u.IsLocalVacation = this.leaveForm.get("IsLocalVacation").value;
            } else {
              u.IsLocalVacation = false;
            }
            u.RequestedFor = this.leaveParams.UserId;

            this.leaveService.postLeave(u).subscribe(
              (res) => {
                Swal.fire("Saved!", "Request has been approved.", "success");

                //console.log(res);

                // if (!this.editMode) {
                //   this.leaveData.push(res);
                // } else {
                //   const Idx = this.leaveData
                //     .map((item) => item.Id)
                //     .indexOf(res.Id);
                //   this.leaveData[Idx] = res;
                // }

                // this.leaveData.sort((val1, val2) => {
                //   return (
                //     new Date(val2.LeaveStarted) - new Date(val1.LeaveStarted)
                //   );
                // });

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
      } else {
        Swal.fire(
          "Failed!",
          "Something went wrong. Please check your data",
          "error"
        );
      }
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

  // editBalance(): boolean {
  //   this.editBalanceValue = !this.editBalanceValue;
  //   return this.editBalanceValue;
  // }

  // updateBalance(): boolean {
  //   this.editBalanceValue = !this.editBalanceValue;
  //   return this.editBalanceValue;
  // }

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
          Swal.fire(
            "Failed!",
            "Server returned with message " + err.Message,
            "error"
          );
        }
      );
    }
  }

  approveRequest(req: VLeaveFilter) {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to approve this request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Yes, approve it!",
    }).then((result) => {
      if (result.value) {
        let s = new UpdateRequestModel();

        s.Id = req.Id;
        s.Status = "A";
        s.Comments = null;

        this.leaveService.postChangeRequestStatus(s).subscribe(
          (x) => {
            //console.log(x);
            const Idx = this.leaveData.map((item) => item.Id).indexOf(req.Id);
            this.leaveData.splice(Idx, 1);
            Swal.fire(
              "Approved!",
              "This request has been Approved.",
              "success"
            );
          },
          (error: HttpErrorResponse) => {
            Swal.fire(
              "Failed!",
              "Server returned with message " + error.status,
              "error"
            );
          }

          // (err) => {
          //   //console.log(err);
          //   Swal.fire(
          //     "Failed!",
          //     "Server returned with message " + err.message,
          //     "error"
          //   );
          // }
        );
      }
    });
  }

  openModal(newDataModal: any) {
    this.leaveForm.reset();

    this.selectedEmployee = new UserProfile();

    this.leaveService.postLeaveBalance(this.leaveParams).subscribe(
      (x) => {
        Object.assign(this.userLeaveBalance, x);
      },
      (err) => {
        Swal.fire("Failed!", "Server returned with message " + err, "error");
      }
    );

    this.modalTitle = "New Request";
    this.modalService.open(newDataModal, { size: "xl", centered: false });
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
