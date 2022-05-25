import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SystemfunctionService } from "src/app/core/services/systemfunction.service";
import { SystemUserFilterParams } from "src/app/pages/employee/SystemUserFilterParams";

@Component({
  selector: "app-employeefilter",
  templateUrl: "./employeefilter.component.html",
  styleUrls: ["./employeefilter.component.scss"],
})
export class EmployeefilterComponent implements OnInit {
  @Input() employeeParams: SystemUserFilterParams;
  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private systemFunction: SystemfunctionService
  ) {
    // this.form = this.fb.group({
    //   Name: fb.control([]),
    //   CivilId: fb.control([]),
    //   FileNo: fb.control([]),
    // });
    this.filterForm = this.fb.group({
      Name: [""],
      CivilId: [""],
      FileNo: [""],
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.filterForm.controls;
  }

  onSubmit() {
    this.employeeParams.CivilId = this.filterForm.get("CivilId").value;
    this.employeeParams.Name = this.filterForm.get("Name").value;
    this.employeeParams.FileNo = this.filterForm.get("FileNo").value;

    this.systemFunction.changeEmployeeFilter(this.employeeParams);
    // console.log(this.filterForm.value);
    // console.log(this.filterForm);
  }
}
