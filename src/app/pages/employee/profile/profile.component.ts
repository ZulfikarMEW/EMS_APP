import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { LeaveBalance } from "src/app/core/models/LeaveBalance";
import { LeaveBalanceDto } from "src/app/core/models/LeaveBalanceDto";
import { LeaveFilterParams } from "src/app/core/models/leaveFilterParams";
import { UserProfile } from "src/app/core/models/userProfile.models";
import { VLeaveFilter } from "src/app/core/models/VLeaveFilter";
import { VLeaveHeader } from "src/app/core/models/VLeaveHeader";
import { LeaveService } from "src/app/core/services/leave.service";
import Swal from "sweetalert2";

import { ChartType } from "./profile.model";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  revenueBarChart: ChartType;
  statData;

  selectedEmployee: UserProfile = new UserProfile();
  userLeaveHeader: VLeaveHeader = new VLeaveHeader();
  userLeaveList: VLeaveFilter[] = [];

  form: FormGroup;
  leaveFilterParamas: LeaveFilterParams = new LeaveFilterParams();
  currentUser: any;
  userLeaveBalance: LeaveBalanceDto[] = [];

  leaveBalance: LeaveBalance = new LeaveBalance();

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    public _cookiesService: CookieService
  ) {
    this.form = this.fb.group({
      formlist: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Employee" },
      { label: "My Profile", active: true },
    ];

    // fetches the data
    this._fetchData();
  }

  /**
   * Fetches the data
   */
  private _fetchData() {
    this.userLeaveList = [];
    this.userLeaveHeader = new VLeaveHeader();
    this.statData = [];

    this.currentUser = JSON.parse(this._cookiesService.get("user"));

    this.leaveFilterParamas = new LeaveFilterParams();
    this.leaveFilterParamas.UserId = this.currentUser.Id;
    this.leaveFilterParamas.Year = new Date().getFullYear();

    this.leaveService
      .postLeaveFilter(this.leaveFilterParamas)
      .subscribe((x) => {
        Object.assign(this.userLeaveList, x);
      });

    this.leaveService
      .postLeaveBalance(this.leaveFilterParamas)
      .subscribe((x) => {
        Object.assign(this.userLeaveBalance, x);
        //console.log(this.userLeaveBalance);

        this.formData().clear();

        this.userLeaveBalance.forEach((o) => {
          let r = this.fb.group({
            Id: o.Id,
            Name: o.Name,
            Balance: o.Balance,
          });
          this.formData().push(r);
        });
      });

    this.leaveService
      .postLeaveHeader(this.leaveFilterParamas)
      .subscribe((x) => {
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

    this.selectedEmployee = this.currentUser;

    // this.revenueBarChart = revenueBarChart;
    // this.statData = statData;
  }

  formData(): FormArray {
    return this.form.get("formlist") as FormArray;
  }

  openBalance(leave) {
    //console.log(leave);
  }

  editBalanceValue: boolean = false;

  editBalance(): boolean {
    this.editBalanceValue = !this.editBalanceValue;
    // //console.log(this.editBalanceValue[i]);
    ////console.log(data);
    return this.editBalanceValue;
  }

  updateBalance(): boolean {
    // this.roleFormSubmit = true;

    if (this.form.valid) {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to update leave balance?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Yes, save it!",
      }).then((result) => {
        if (result.value) {
          let u: LeaveBalance[] = [];

          (<FormArray>this.form.get("formlist")).controls.forEach((e) => {
            let f = new LeaveBalance();

            f.Balance = e.value.Balance;
            f.SystemUserId = this.selectedEmployee.Id;
            f.LeaveTypeId = e.value.Id;
            f.Tstamp = new Date();

            u.push(f);
          });

          this.leaveService.postUpdateLeaveBalance(u).subscribe(
            (res) => {
              Swal.fire(
                "Saved!",
                "Leave balance for " +
                  this.selectedEmployee.Name +
                  " has been updated.",
                "success"
              );

              this.editBalanceValue = !this.editBalanceValue;
            },
            (err) => {
              Swal.fire(
                "Failed!",
                "Something went wrong. Please check your data",
                "error"
              );
            }
          );
        }
      });
    }

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
}
