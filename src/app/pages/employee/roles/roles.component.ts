import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RoleFunction } from "src/app/core/models/RoleFunction";
import { SystemRole } from "src/app/core/models/SystemRole";
import { SystemRoleFunction } from "src/app/core/models/SystemRoleFunction";
import { SystemfunctionService } from "src/app/core/services/systemfunction.service";
import { UserProfileService } from "src/app/core/services/user.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-roles",
  templateUrl: "./roles.component.html",
  styleUrls: ["./roles.component.scss"],
})
export class RolesComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  roleList: SystemRole[] = [];
  systemRoleFunction: SystemRoleFunction[] = [];

  editMode: boolean;
  roleForm: FormGroup;
  modalTitle: string;
  roleFormSubmit: boolean = false;

  form: FormGroup;

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
    private modalService: NgbModal
  ) {
    this.form = this.fb.group({
      formlist: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Role" },
      { label: "Role List", active: true },
    ];

    this.userService.getUserRoleFunction().subscribe((res: any) => {
      Object.assign(this.userAccess, res.RoleFunctions);

      this.userAccessFiltered = this.userAccess.find(
        (t) => t.SystemRoleFunctionId == 3
      );

      if (this.userAccessFiltered != null) {
        this.hasViewAccess = this.userAccessFiltered.AllowView;
        this.hasAddAccess = this.userAccessFiltered.AllowAdd;
        this.hasEditAccess = this.userAccessFiltered.AllowEdit;
        this.hasDeleteAccess = this.userAccessFiltered.AllowDelete;
      }
    });

    this.roleForm = this.fb.group({
      Id: [""],
      Name: ["", [Validators.required]],
      Description: [""],
      Active: [true],
      Tstamp: [new Date()],
    });

    this.roleFormSubmit = false;

    this.userService.getRoles().subscribe((x) => {
      Object.assign(this.roleList, x);
      this.roleList.sort((a, b) => a.Name.localeCompare(b.Name));
    });

    this.userService.getRoleFunction().subscribe((x) => {
      Object.assign(this.systemRoleFunction, x);
      this.systemRoleFunction.sort((a, b) => a.Name.localeCompare(b.Name));
    });
  }

  formData(): FormArray {
    return this.form.get("formlist") as FormArray;
  }

  /**
   * Open Large modal
   * @param newDataModal large modal data
   */

  openModal(newDataModal: any) {
    this.formData().clear();

    this.systemRoleFunction.sort((a, b) => a.Name.localeCompare(b.Name));

    //console.log(this.systemRoleFunction);

    this.systemRoleFunction.forEach((o) => {
      let r = this.fb.group({
        Id: o.Id,
        Name: o.Name,
        AllowView: false,
        AllowAdd: false,
        AllowEdit: false,
        AllowDelete: false,
      });

      this.formData().push(r);
    });

    this.editMode = false;
    this.roleForm.reset();
    this.modalTitle = "New role";
    this.modalService.open(newDataModal);
  }

  openEditModal(newDataModal: any, emp: SystemRole) {
    this.modalTitle = emp.Name;

    //console.log(emp);
    //console.log(this.systemRoleFunction);

    this.formData().clear();

    // emp.RoleFunctions.sort((a, b) =>
    //   a.SystemRoleFunction.Name.localeCompare(b.SystemRoleFunction.Name)
    // );

    this.systemRoleFunction.forEach((o) => {
      // emp.RoleFunctions.filter;
      let rf: RoleFunction = emp.RoleFunctions.find(
        (t) => t.SystemRoleFunctionId === o.Id
      );

      let aV: boolean = false;
      let aA: boolean = false;
      let aE: boolean = false;
      let aD: boolean = false;

      if (rf != null) {
        aV = rf.AllowView;
        aA = rf.AllowAdd;
        aE = rf.AllowEdit;
        aD = rf.AllowDelete;
      }

      let r = this.fb.group({
        Id: o.Id,
        Name: o.Name,
        AllowView: aV,
        AllowAdd: aA,
        AllowEdit: aE,
        AllowDelete: aD,
      });

      this.formData().push(r);
    });

    // emp.RoleFunctions.forEach((o) => {
    //   let r = this.fb.group({
    //     Id: o.SystemRoleFunctionId,
    //     Name: o.SystemRoleFunction.Name,
    //     AllowView: o.AllowView,
    //     AllowAdd: o.AllowAdd,
    //     AllowEdit: o.AllowEdit,
    //     AllowDelete: o.AllowDelete,
    //   });

    //   this.formData().push(r);
    // });

    this.roleForm.controls.Id.setValue(emp.Id);
    this.roleForm.controls.Name.setValue(emp.Name);
    this.roleForm.controls.Description.setValue(emp.Description);
    this.roleForm.controls.Active.setValue(emp.Active);
    this.roleForm.controls.Tstamp.setValue(emp.Tstamp);

    this.editMode = true;
    this.modalService.open(newDataModal);
  }

  get f() {
    return this.roleForm.controls;
  }

  onSubmit() {
    if (this.hasAddAccess && this.hasEditAccess) {
      this.roleFormSubmit = true;

      if (this.roleForm.valid) {
        Swal.fire({
          title: "Are you sure?",
          text: "You want to save this role?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Yes, save it!",
        }).then((result) => {
          if (result.value) {
            let u = new SystemRole();
            u.RoleFunctions = [];

            u.Id = this.roleForm.get("Id").value;
            u.Name = this.roleForm.get("Name").value;
            u.Description = this.roleForm.get("Description").value;
            u.Active = this.roleForm.get("Active").value;
            u.Tstamp = this.roleForm.get("Tstamp").value;

            (<FormArray>this.form.get("formlist")).controls.forEach((e) => {
              let f = new RoleFunction();

              f.SystemRoleFunctionId = e.value.Id;
              f.AllowAdd = e.value.AllowAdd;
              f.AllowDelete = e.value.AllowDelete;
              f.AllowEdit = e.value.AllowEdit;
              f.AllowView = e.value.AllowView;
              f.SystemRoleId = u.Id;

              u.RoleFunctions.push(f);
            });

            this.userService.postRole(u).subscribe(
              (res) => {
                Swal.fire("Saved!", res.Name + " has been saved.", "success");

                this.userService.getRoles().subscribe((x) => {
                  Object.assign(this.roleList, x);
                  this.roleList.sort((a, b) => a.Name.localeCompare(b.Name));
                  //console.log(this.roleList);
                });

                this.modalService.dismissAll();
                this.formData().clear();
                this.roleFormSubmit = false;
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

  trackByFn(index, item) {
    return item.id; // unique id corresponding to the item
  }
}
