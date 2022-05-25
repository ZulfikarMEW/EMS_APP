import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SystemfunctionService } from "src/app/core/services/systemfunction.service";
import { PersonalData } from "src/app/pages/personal/PersonalData";

@Component({
  selector: "app-personal-data-filter",
  templateUrl: "./personal-data-filter.component.html",
  styleUrls: ["./personal-data-filter.component.scss"],
})
export class PersonalDataFilterComponent implements OnInit {
  //@Input()
  params: PersonalData = new PersonalData();
  filterForm: FormGroup;
  isCollapse: boolean = false;

  @Output() outParams = new EventEmitter<PersonalData>();

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
      FileNo: [""],
      CivilIdNo: [""],
      DateBirth: [""],
      DateJoin: [""],
      PhoneNo: [""],
      ArticleNo: [""],
      PermanencyType: [""],
      InsideBuilding: [""],
      AdvHousing: [""],
      AdvMobile: [""],
      AdvVehicle: [""],
      GenderId: [""],
      MasterDepartmentId: [""],
      MasterJobDegreeId: [""],
      MasterFunctionalGroupId: [""],
      MasterDesignationId: [""],
      MasterJobTitleId: [""],
      MasterJobDescriptionId: [""],
      MasterNationalityId: [""],
      MasterBudgetTypeId: [""],
      MasterReasonForPromotionId: [""],
      MasterJobLevelId: [""],
      NextJobLevelId: [""],
      NextJobLevelDate: [""],
      MasterGradeId: [""],
      NextGradeId: [""],
      IsRetired: [""],
      MasterReasonForRetirementId: [""],
      Notes: [""],
    });
  }

  ngOnInit(): void {
    this.isCollapse = false;
  }

  get f() {
    return this.filterForm.controls;
  }

  onSubmit() {
    this.params.CivilIdNo = this.filterForm.get("CivilIdNo").value;
    this.params.Name = this.filterForm.get("Name").value;
    this.params.FileNo = this.filterForm.get("FileNo").value;

    // this.params.DateBirth = this.filterForm.get("DateBirth").value;
    // this.params.DateJoin = this.filterForm.get("DateJoin").value;
    // this.params.PhoneNo = this.filterForm.get("PhoneNo").value;
    // this.params.ArticleNo = this.filterForm.get("ArticleNo").value;
    // this.params.PermanencyType = this.filterForm.get("PermanencyType").value;
    // this.params.InsideBuilding = this.filterForm.get("InsideBuilding").value;
    // this.params.AdvHousing = this.filterForm.get("AdvHousing").value;
    // this.params.AdvMobile = this.filterForm.get("AdvMobile").value;
    // this.params.AdvVehicle = this.filterForm.get("AdvVehicle").value;
    // this.params.GenderId = this.filterForm.get("GenderId").value;
    // this.params.MasterDepartmentId =
    //   this.filterForm.get("MasterDepartmentId").value;
    // this.params.MasterJobDegreeId =
    //   this.filterForm.get("MasterJobDegreeId").value;
    // this.params.MasterFunctionalGroupId = this.filterForm.get(
    //   "MasterFunctionalGroupId"
    // ).value;
    // this.params.MasterDesignationId = this.filterForm.get(
    //   "MasterDesignationId"
    // ).value;
    // this.params.MasterJobTitleId =
    //   this.filterForm.get("MasterJobTitleId").value;
    // this.params.MasterJobDescriptionId = this.filterForm.get(
    //   "MasterJobDescriptionId"
    // ).value;
    // this.params.MasterNationalityId = this.filterForm.get(
    //   "MasterNationalityId"
    // ).value;
    // this.params.MasterBudgetTypeId =
    //   this.filterForm.get("MasterBudgetTypeId").value;
    // this.params.MasterJobLevelId =
    //   this.filterForm.get("MasterJobLevelId").value;
    // this.params.NextJobLevelId = this.filterForm.get("NextJobLevelId").value;
    // this.params.NextJobLevelDate =
    //   this.filterForm.get("NextJobLevelDate").value;
    // this.params.MasterGradeId = this.filterForm.get("MasterGradeId").value;
    // this.params.CurrentGradeDate =
    //   this.filterForm.get("CurrentGradeDate").value;
    // this.params.NextGradeId = this.filterForm.get("NextGradeId").value;
    // this.params.NextGradeDate = this.filterForm.get("NextGradeDate").value;
    // this.params.CurrentNoOfAllowances = this.filterForm.get(
    //   "CurrentNoOfAllowances"
    // ).value;
    // this.params.NextNoOfAllowances =
    //   this.filterForm.get("NextNoOfAllowances").value;
    // this.params.IsRetired = this.filterForm.get("IsRetired").value;
    // this.params.MasterReasonForRetirementId = this.filterForm.get(
    //   "MasterReasonForRetirementId"
    // ).value;
    // this.params.RevisedBy = this.filterForm.get("RevisedBy").value;
    // this.params.DateRevised = this.filterForm.get("DateRevised").value;
    // this.params.Notes = this.filterForm.get("Notes").value;

    this.outParams.emit(this.params);

    //this.systemFunction.changeEmployeeFilter(this.params);
    // console.log(this.filterForm.value);
    // console.log(this.filterForm);
  }
}
