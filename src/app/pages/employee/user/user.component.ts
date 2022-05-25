import { Component, EventEmitter, OnInit } from "@angular/core";
import { UserProfile } from "src/app/core/models/userProfile.models";
import { SystemfunctionService } from "src/app/core/services/systemfunction.service";
import { UserProfileService } from "src/app/core/services/user.service";
import { SystemUserFilterParams } from "../SystemUserFilterParams";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MustMatch } from "../../form/validation/validation.mustmatch";
import { SystemGender } from "src/app/core/models/SystemGender";
import { SystemLanguage } from "src/app/core/models/SystemLanguage";

import Swal from "sweetalert2";
import { ResetPassword } from "src/app/core/models/resetPassword";
import { SystemRole } from "src/app/core/models/SystemRole";
import { LeaveService } from "src/app/core/services/leave.service";
import { LeaveFilterParams } from "src/app/core/models/leaveFilterParams";
import { VLeaveFilter } from "src/app/core/models/VLeaveFilter";
import { VLeaveHeader } from "src/app/core/models/VLeaveHeader";
import { LeaveBalanceDto } from "src/app/core/models/LeaveBalanceDto";
import { SystemDepartment } from "src/app/core/models/SystemDepartment";
import { SystemCountry } from "src/app/core/models/SystemCountry";
import { LeaveBalance } from "src/app/core/models/LeaveBalance";
import { RoleFunction } from "src/app/core/models/RoleFunction";

declare var $;

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"],
})
export class UserComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  employeeParams: SystemUserFilterParams = new SystemUserFilterParams();
  employeeList: UserProfile[] = [];
  selectedEmployee: UserProfile = new UserProfile();

  genderList: SystemGender[] = [];
  languageList: SystemLanguage[] = [];
  roleList: SystemRole[] = [];

  userLeaveList: VLeaveFilter[] = [];

  event: EventEmitter<any> = new EventEmitter();
  modalTitle: string = "";

  employeeForm: FormGroup;
  employeeEditForm: FormGroup;
  passwordResetForm: FormGroup;

  form: FormGroup;

  empFormSubmit: boolean = false;
  resetFormSubmit: boolean = false;

  editMode: boolean = false;
  statData: { icon: string; title: string; value: number }[];
  leaveFilterParamas: LeaveFilterParams;
  userLeaveHeader: VLeaveHeader = new VLeaveHeader();
  userLeaveBalance: LeaveBalanceDto[] = [];
  loading: boolean = false;
  filterForm: FormGroup;
  departmentList: SystemDepartment[] = [];
  nationalityList: SystemCountry[] = [];

  userAccess: RoleFunction[] = [];
  hasViewAccess: boolean = false;
  hasAddAccess: boolean = false;
  hasEditAccess: boolean = false;
  hasDeleteAccess: boolean = false;
  userAccessFiltered: RoleFunction = new RoleFunction();

  constructor(
    private fb: FormBuilder,
    private systemFunction: SystemfunctionService,
    private userService: UserProfileService,
    private leaveService: LeaveService,
    private modalService: NgbModal
  ) {
    this.form = this.fb.group({
      formlist: this.fb.array([]),
    });

    this.filterForm = this.fb.group({
      Name: [""],
      CivilId: [""],
      FileNo: [""],
    });
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Users" },
      { label: "User List", active: true },
    ];

    this.userService.getUserRoleFunction().subscribe((res: any) => {
      Object.assign(this.userAccess, res.RoleFunctions);

      this.userAccessFiltered = this.userAccess.find(
        (t) => t.SystemRoleFunctionId == 2
      );

      if (this.userAccessFiltered != null) {
        this.hasViewAccess = this.userAccessFiltered.AllowView;
        this.hasAddAccess = this.userAccessFiltered.AllowAdd;
        this.hasEditAccess = this.userAccessFiltered.AllowEdit;
        this.hasDeleteAccess = this.userAccessFiltered.AllowDelete;
      }
    });

    // this.userAccessFiltered = this.userAccess.find(
    //   (t) => t.SystemRoleFunctionId == 1
    // );

    // this.userAccessFiltered = this.userAccess.filter(
    //   (t) => t.SystemRoleFunctionId === 1
    // )[0];

    // const Idx = this.userAccess
    //   .map((item) => item.SystemRoleFunctionId)
    //   .indexOf(1);

    // console.log(Idx);

    // this.employeeParams = {
    //   Name: string,
    //   CivilId: String,
    //   FileNo: String,
    // };
    // this.systemFunction.currentEmployeeFilter.subscribe((x) => {
    //   //this.employeeParams = cid;
    //   Object.assign(this.employeeParams, x);
    //   this.employeeList.sort((a, b) => a.Name.localeCompare(b.Name));
    //   if (
    //     this.employeeParams.CivilId != "" &&
    //     this.employeeParams.Name != "" &&
    //     this.employeeParams.FileNo != ""
    //   ) {
    //     this.onChangeFilterParams();
    //   }
    //   ////console.log(this.employeeParams);
    // });

    // this.systemFunction.getSystemDepartmentList().subscribe((x) => {
    //   Object.assign(this.departmentList, x);
    // });

    // this.systemFunction.getSystemCountryList().subscribe((x) => {
    //   Object.assign(this.nationalityList, x);
    // });

    this.systemFunction.getSystemGenderList().subscribe((x) => {
      Object.assign(this.genderList, x);
    });

    this.systemFunction.getSystemLanguageList().subscribe((x) => {
      Object.assign(this.languageList, x);
    });

    this.userService.getRoles().subscribe((x) => {
      Object.assign(this.roleList, x);
      this.roleList.sort((a, b) => a.Name.localeCompare(b.Name));
    });

    this.employeeForm = this.fb.group(
      {
        Id: [""],
        FileNo: ["", [Validators.required, Validators.pattern("[0-9]+")]],
        CivilId: ["", [Validators.required, Validators.pattern("[0-9]+")]],
        Name: ["", [Validators.required]],
        UserName: [
          "",
          [Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$")],
        ],
        Email: [
          "",
          [
            Validators.required,
            Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
          ],
        ],
        Mobile: ["", [Validators.pattern("[0-9]+")]],
        HomePhone: ["", [Validators.pattern("[0-9]+")]],
        OfficePhone: ["", [Validators.pattern("[0-9]+")]],
        Description: [""],
        Address: [""],
        SystemRoleId: ["", [Validators.required]],
        GenderId: ["", [Validators.required]],
        SystemLanguageId: ["", [Validators.required]],
        // SystemCountryId: ["", [Validators.required]],
        // SystemDepartmentId: ["", [Validators.required]],
        DateOfBirth: [""],
        DateOfJoin: [""],
        Active: [true],
        IsLockedOut: [false],
        IsSuperUser: [false],
        Tstamp: [new Date()],
        Password: [
          "",
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
            ),
          ],
        ],
        ConfirmPassword: ["", Validators.required],
      },
      {
        validator: MustMatch("Password", "ConfirmPassword"),
      }
    );

    this.employeeEditForm = this.fb.group({
      Id: [""],
      FileNo: ["", [Validators.required, Validators.pattern("[0-9]+")]],
      CivilId: ["", [Validators.required, Validators.pattern("[0-9]+")]],
      Name: ["", [Validators.required]],
      UserName: [
        "",
        [Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$")],
      ],
      Mobile: ["", [Validators.pattern("[0-9]+")]],
      HomePhone: ["", [Validators.pattern("[0-9]+")]],
      OfficePhone: ["", [Validators.pattern("[0-9]+")]],
      Description: [""],
      Address: [""],
      SystemRoleId: ["", [Validators.required]],
      SystemGenderId: ["", [Validators.required]],
      SystemLanguageId: ["", [Validators.required]],
      SystemCountryId: ["", [Validators.required]],
      SystemDepartmentId: ["", [Validators.required]],
      DateOfBirth: [""],
      DateOfJoin: [""],
      Active: [true],
      IsLockedOut: [false],
      IsSuperUser: [false],
      Tstamp: [new Date()],
    });

    this.passwordResetForm = this.fb.group(
      {
        Id: [""],
        NewPassword: ["", [Validators.required, Validators.minLength(6)]],
        ConfirmPassword: ["", Validators.required],
      },
      {
        validator: MustMatch("NewPassword", "ConfirmPassword"),
      }
    );

    this.empFormSubmit = false;
    this.resetFormSubmit = false;
    //this.systemFunction.changeEmployeeFilter(this.employeeParams);
  }

  onChangeFilterParams() {
    this.loading = true;
    //console.log(this.employeeParams);
    this.employeeList = [];
    this.userService.getUsersList(this.employeeParams).subscribe((x) => {
      Object.assign(this.employeeList, x);
      this.employeeList.sort((a, b) => a.Name.localeCompare(b.Name));
      this.loading = false;
      ////console.log(this.employeeList);
      //this.filterBranch();
    });
  }

  /**
   * Open Large modal
   * @param newDataModal large modal data
   */

  /**
   * Open Normal modal
   * @param changeModal Normal modal data
   */

  openModal(newDataModal: any) {
    this.editMode = false;
    this.employeeForm.reset();
    this.modalTitle = "New Employee";
    this.modalService.open(newDataModal, { size: "lg", centered: false });
    // this.modalService.open(newDataModal);
  }

  openProfileModal(profileDataModal: any, emp: UserProfile) {
    this.editMode = false;
    this.employeeForm.reset();
    this.modalTitle = emp.Name;

    this.userLeaveList = [];
    this.userLeaveHeader = new VLeaveHeader();
    this.statData = [];

    this.leaveFilterParamas = new LeaveFilterParams();
    this.leaveFilterParamas.UserId = emp.Id;
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

    this.selectedEmployee = emp;

    this.modalService.open(profileDataModal, { size: "xl", centered: false });
    // this.modalService.open(newDataModal);
  }

  openChangePasswordModal(changeModal: any, emp: UserProfile) {
    this.editMode = false;
    this.modalTitle = emp.Name;
    this.passwordResetForm.controls.Id.setValue(emp.Id);
    // this.modalService.open(changeModal, { size: "lg", centered: false });
    this.modalService.open(changeModal); // this.modalService.open(newDataModal);
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

  openEditModal(editDataModal: any, emp: UserProfile) {
    this.modalTitle = emp.Name;

    this.employeeEditForm.controls.Id.setValue(emp.Id);
    this.employeeEditForm.controls.FileNo.setValue(emp.FileNo);
    this.employeeEditForm.controls.CivilId.setValue(emp.CivilId);
    this.employeeEditForm.controls.Name.setValue(emp.Name);
    this.employeeEditForm.controls.Mobile.setValue(emp.Mobile);
    this.employeeEditForm.controls.HomePhone.setValue(emp.HomePhone);
    this.employeeEditForm.controls.OfficePhone.setValue(emp.OfficePhone);
    this.employeeEditForm.controls.Description.setValue(emp.Description);
    this.employeeEditForm.controls.Address.setValue(emp.Address);
    this.employeeEditForm.controls.SystemRoleId.setValue(emp.SystemRoleId);
    this.employeeEditForm.controls.SystemGenderId.setValue(emp.GenderId);
    // this.employeeEditForm.controls.SystemCountryId.setValue(
    //   emp.SystemCountryId
    // );
    // this.employeeEditForm.controls.SystemDepartmentId.setValue(
    //   emp.SystemDepartmentId
    // );
    this.employeeEditForm.controls.SystemLanguageId.setValue(
      emp.SystemLanguageId
    );
    this.employeeEditForm.controls.DateOfBirth.setValue(emp.DateOfBirth);
    this.employeeEditForm.controls.DateOfJoin.setValue(emp.DateOfJoin);
    this.employeeEditForm.controls.Active.setValue(emp.Active);
    this.employeeEditForm.controls.IsLockedOut.setValue(emp.IsLockedOut);
    this.employeeEditForm.controls.IsSuperUser.setValue(emp.IsSuperUser);
    this.employeeEditForm.controls.Tstamp.setValue(emp.Tstamp);

    this.editMode = true;

    this.modalService.open(editDataModal, { size: "lg", centered: false });
    // this.modalService.open(newDataModal);
  }

  get f() {
    return this.employeeForm.controls;
  }

  get e() {
    return this.employeeEditForm.controls;
  }

  get p() {
    return this.passwordResetForm.controls;
  }

  get l() {
    return this.filterForm.controls;
  }

  onSubmitFilter() {
    this.employeeParams.CivilId = this.filterForm.get("CivilId").value;
    this.employeeParams.Name = this.filterForm.get("Name").value;
    this.employeeParams.FileNo = this.filterForm.get("FileNo").value;

    this.onChangeFilterParams();
    //this.systemFunction.changeEmployeeFilter(this.employeeParams);
    // //console.log(this.filterForm.value);
    // //console.log(this.filterForm);
  }

  onSubmit() {
    if (this.hasAddAccess) {
      //console.log(this.employeeForm);
      this.empFormSubmit = true;

      if (this.employeeForm.valid) {
        Swal.fire({
          title: "Are you sure?",
          text: "You want to save this employee?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Yes, save it!",
        }).then((result) => {
          if (result.value) {
            let u = new UserProfile();

            u.Id = this.employeeForm.get("Id").value;
            u.FileNo = this.employeeForm.get("FileNo").value;
            u.CivilId = this.employeeForm.get("CivilId").value;
            u.Name = this.employeeForm.get("Name").value;
            u.UserName = this.employeeForm.get("UserName").value;
            u.Email = this.employeeForm.get("Email").value;
            u.Mobile = this.employeeForm.get("Mobile").value;
            u.HomePhone = this.employeeForm.get("HomePhone").value;
            u.OfficePhone = this.employeeForm.get("OfficePhone").value;
            u.Description = this.employeeForm.get("Description").value;
            u.Address = this.employeeForm.get("Address").value;
            u.SystemRoleId = this.employeeForm.get("SystemRoleId").value;
            u.GenderId = this.employeeForm.get("GenderId").value;
            u.SystemLanguageId =
              this.employeeForm.get("SystemLanguageId").value;
            // u.SystemDepartmentId =
            //   this.employeeForm.get("SystemDepartmentId").value;
            // u.SystemCountryId = this.employeeForm.get("SystemCountryId").value;
            u.DateOfBirth = this.employeeForm.get("DateOfBirth").value;
            u.DateOfJoin = this.employeeForm.get("DateOfJoin").value;
            u.Active = this.employeeForm.get("Active").value;
            u.IsLockedOut = this.employeeForm.get("IsLockedOut").value;
            u.IsSuperUser = this.employeeForm.get("IsSuperUser").value;
            u.Tstamp = this.employeeForm.get("Tstamp").value;
            u.Password = this.employeeForm.get("Password").value;
            u.ConfirmPassword = this.employeeForm.get("ConfirmPassword").value;

            this.userService.postUser(u).subscribe(
              (res) => {
                Swal.fire("Saved!", res.Name + " has been saved.", "success");

                if (!this.editMode) {
                  this.employeeList.push(res);
                } else {
                  const Idx = this.employeeList
                    .map((item) => item.Id)
                    .indexOf(res.Id);
                  this.employeeList[Idx] = res;
                }
                this.employeeList.sort((a, b) => a.Name.localeCompare(b.Name));

                this.modalService.dismissAll();
                this.empFormSubmit = false;
                this.editMode = false;
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
    } else {
      Swal.fire(
        "Access Denied!",
        "You do not have access to perform this action",
        "error"
      );
    }
  }

  onSubmitEdit() {
    if (this.hasEditAccess) {
      //console.log(this.employeeEditForm);
      this.empFormSubmit = true;

      if (this.employeeEditForm.valid) {
        Swal.fire({
          title: "Are you sure?",
          text: "You want to save this employee?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Yes, save it!",
        }).then((result) => {
          if (result.value) {
            let u = new UserProfile();

            u.Id = this.employeeEditForm.get("Id").value;
            u.FileNo = this.employeeEditForm.get("FileNo").value;
            u.CivilId = this.employeeEditForm.get("CivilId").value;
            u.Name = this.employeeEditForm.get("Name").value;
            u.Mobile = this.employeeEditForm.get("Mobile").value;
            u.HomePhone = this.employeeEditForm.get("HomePhone").value;
            u.OfficePhone = this.employeeEditForm.get("OfficePhone").value;
            u.Description = this.employeeEditForm.get("Description").value;
            u.Address = this.employeeEditForm.get("Address").value;
            u.SystemRoleId = this.employeeEditForm.get("SystemRoleId").value;
            u.GenderId = this.employeeEditForm.get("GenderId").value;
            u.SystemLanguageId =
              this.employeeEditForm.get("SystemLanguageId").value;
            // u.SystemDepartmentId =
            //   this.employeeEditForm.get("SystemDepartmentId").value;
            // u.SystemCountryId =
            //   this.employeeEditForm.get("SystemCountryId").value;
            u.DateOfBirth = this.employeeEditForm.get("DateOfBirth").value;
            u.DateOfJoin = this.employeeEditForm.get("DateOfJoin").value;
            u.Active = this.employeeEditForm.get("Active").value;
            u.IsLockedOut = this.employeeEditForm.get("IsLockedOut").value;
            u.IsSuperUser = this.employeeEditForm.get("IsSuperUser").value;
            u.Tstamp = this.employeeEditForm.get("Tstamp").value;

            this.userService.updateUser(u).subscribe(
              (res) => {
                Swal.fire("Saved!", res.Name + " has been saved.", "success");

                if (!this.editMode) {
                  this.employeeList.push(res);
                } else {
                  const Idx = this.employeeList
                    .map((item) => item.Id)
                    .indexOf(res.Id);
                  this.employeeList[Idx] = res;
                }
                this.employeeList.sort((a, b) => a.Name.localeCompare(b.Name));

                this.modalService.dismissAll();
                this.empFormSubmit = false;
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
      }
    } else {
      Swal.fire(
        "Access Denied!",
        "You do not have access to perform this action",
        "error"
      );
    }
  }

  changePassword() {
    if (this.hasEditAccess) {
      this.resetFormSubmit = true;

      //console.log(this.passwordResetForm.value);

      if (this.passwordResetForm.valid) {
        Swal.fire({
          title: "Are you sure?",
          text: "You want to reset password?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Yes, reset it!",
        }).then((result) => {
          if (result.value) {
            let u = new ResetPassword();

            u.Id = this.passwordResetForm.get("Id").value;
            u.NewPassword = this.passwordResetForm.get("NewPassword").value;
            u.ConfirmPassword =
              this.passwordResetForm.get("ConfirmPassword").value;

            this.userService.resetPassword(u).subscribe(
              (res) => {
                Swal.fire(
                  "Reset!",
                  "New password has been updated.",
                  "success"
                );

                this.modalService.dismissAll();
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
      }
    } else {
      Swal.fire(
        "Access Denied!",
        "You do not have access to perform this action",
        "error"
      );
    }
  }

  // editMobile(className, leave) {
  //   var text = $("." + className).text();
  //   var input = $(
  //     '<input id="' + className + '" type="text" value="' + text + '" />'
  //   );
  //   $("." + className)
  //     .text("")
  //     .append(input);
  //   input.select();

  //   input.blur(function () {
  //     var text = $("#" + className).val();
  //     $("#" + className)
  //       .parent()
  //       .text(text);
  //     $("#" + className).remove();
  //   });
  // }

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

  // updateBalance(): boolean {
  //   this.editBalanceValue = !this.editBalanceValue;
  //   // //console.log(this.editBalanceValue[i]);
  //   ////console.log(data);
  //   return this.editBalanceValue;
  // }

  updateBalance(): boolean {
    if (this.hasEditAccess) {
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
    } else {
      Swal.fire(
        "Access Denied!",
        "You do not have access to perform this action",
        "error"
      );
    }
    return this.editBalanceValue;
  }

  trackByFn(index, item) {
    return item.id; // unique id corresponding to the item
  }

  passwordIsValid = false;

  passwordValid(event) {
    this.passwordIsValid = event;
  }
  // validateSelect() {
  //   $(".select2").select2();

  //   $("#form-test").validate({
  //     errorClass: "help-block animation-pullUp",
  //     errorElement: "div",
  //     keyUp: true,
  //     errorPlacement: function (error, e) {
  //       e.parents(".form-group").append(error);
  //     },
  //     highlight: function (e) {
  //       $(e)
  //         .closest(".form-group")
  //         .removeClass("has-success has-error")
  //         .addClass("has-error");
  //       $(e).closest(".help-block").remove();
  //     },
  //     success: function (e) {
  //       e.closest(".form-group").removeClass("has-success has-error");
  //       e.closest(".help-block").remove();
  //     },
  //     rules: {
  //       select: { required: true },
  //     },
  //     messages: {
  //       select: { required: "error" },
  //     },
  //   });
  // }

  // isSubmitted = false;
  // City: any = ["Florida", "South Dakota", "Tennessee", "Michigan"];

  // registrationForm = this.fb.group({
  //   cityName: ["", [Validators.required]],
  // });
  // changeCity(e: any) {
  //   this.cityName?.setValue(e.target.value, {
  //     onlySelf: true,
  //   });
  // }
  // // Access formcontrols getter
  // get cityName() {
  //   return this.registrationForm.get("cityName");
  // }
  // onSubmitTest(): void {
  //   console.log(this.registrationForm);
  //   this.isSubmitted = true;
  //   if (!this.registrationForm.valid) {
  //     false;
  //   } else {
  //     console.log(JSON.stringify(this.registrationForm.value));
  //   }
  // }
}
