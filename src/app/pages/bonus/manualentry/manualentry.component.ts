import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BonusService } from "src/app/core/services/bonus.service";
import { MastersService } from "src/app/core/services/masters.service";
import Swal from "sweetalert2";
import { Bonus } from "../Bonus";
import { VBonusEligibleList } from "./VBonusEligibleList";

@Component({
  selector: "app-manualentry",
  templateUrl: "./manualentry.component.html",
  styleUrls: ["./manualentry.component.scss"],
})
export class ManualentryComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  // params: PersonalData = new PersonalData();
  // subDataParams: PersonalData = new PersonalData();
  // Collapse declare
  isCollapsed: boolean;

  // dataList: VPersonalAnnualEvaluation[] = [];
  // historyDataList: VPersonalAnnualEvaluation[] = [];

  // masterData: MasterAnnualEvaluation[] = [];
  personalDataList: VBonusEligibleList[] = [];
  dataList: VBonusEligibleList[] = [];
  // historyDataList: VBonusEligibleList[] = [];

  bonusList: Bonus[] = [];

  form: FormGroup;
  yearForm: FormGroup;
  formSubmit: boolean = false;

  isLoading: boolean = false;

  year: number;
  // personalDataParams: PersonalDataParams = new PersonalDataParams();

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private bonusService: BonusService,
    private masterService: MastersService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Bonus" },
      { label: "Manual Entry", active: true },
    ];

    // Collapse value
    this.isCollapsed = false;

    this.form = this.fb.group({
      Id: [""],
      PersonalDataId: ["", [Validators.required]],
      Amount: ["", [Validators.required, Validators.min(0)]],
      Year: ["", [Validators.required, Validators.min(0)]],
      Note: [""],
    });

    this.yearForm = this.fb.group({
      Year: ["", [Validators.required, Validators.min(0)]],
    });
  }

  get f() {
    return this.form.controls;
  }

  get y() {
    return this.yearForm.controls;
  }

  onYearSearch() {
    //console.log(this.form.value);
  }

  fetchData() {
    if (!this.yearForm.invalid) {
      var startTime = performance.now();
      this.isLoading = true;

      this.bonusService
        .getBonusEligibleList(this.yearForm.value.Year)
        .subscribe(
          (x) => {
            Object.assign(this.dataList, x);

            this.isLoading = false;
            var endTime = performance.now();

            //console.log(this.dataList);
            // Swal.fire(
            //   this.dataList.length +
            //     " record(s) found in " +
            //     ((endTime - startTime) * 0.001).toFixed(2) +
            //     " seconds."
            // );
          },
          (err) => {
            Swal.fire("Failed!", "Something went wrong.", "error");

            this.isLoading = false;
          }
        );
    } else {
      Swal.fire("Failed!", "Invalid year.", "error");
    }
  }

  fetchPersonalData() {
    var startTime = performance.now();
    this.isLoading = true;
    this.personalDataList = [];

    this.bonusService.getBonusEligibleList(this.year).subscribe(
      (x) => {
        Object.assign(this.personalDataList, x);

        this.isLoading = false;
        var endTime = performance.now();

        Swal.fire(
          this.personalDataList.length +
            " record(s) found in " +
            ((endTime - startTime) * 0.001).toFixed(2) +
            " seconds."
        );

        //this.fetchData();
        // Swal.fire(
        //   this.dataList.length +
        //     " record(s) found in " +
        //     ((endTime - startTime) * 0.001).toFixed(2) +
        //     " seconds."
        // );
      },
      (err) => {
        Swal.fire("Failed!", "Something went wrong.", "error");

        this.isLoading = false;
      }
    );
  }

  isCheckedMap = {};
  checkedItems = [];

  check($event, inputElement, row, i) {
    this.isCheckedMap[i] = !this.isCheckedMap[i]; // toggle the value based on index

    if (i == -1) {
      if (this.isCheckedMap[i]) {
        // this.checkedItems = [];
        Object.assign(this.checkedItems, this.dataList);

        for (let i in this.dataList) {
          this.isCheckedMap[i] = true;
        }
      } else {
        this.checkedItems = [];

        for (let i in this.dataList) {
          this.isCheckedMap[i] = false;
        }
      }
    }

    if (i != -1) {
      if (!this.isCheckedMap[i]) {
        this.checkedItems.forEach((value, index) => {
          if (value.Id == row.Id) this.checkedItems.splice(index, 1);
        });
      } else {
        this.checkedItems.push(row);
      }

      if (this.checkedItems.length == this.dataList.length) {
        this.isCheckedMap[-1] = true;
      } else {
        this.isCheckedMap[-1] = false;
      }
    }
  }

  onSelected(item) {
    //console.log(item);
  }

  openEditModal(dataModal: any, item: any) {
    this.form.reset();

    this.form.controls.Id.setValue(item.Id);
    this.form.controls.Name.setValue(item.Name);
    this.form.controls.FileNo.setValue(item.FileNo);
    this.form.controls.CivilIdNo.setValue(item.CivilIdNo);
    // this.form.controls.DateBirth.setValue(item.DateBirth);
    // this.form.controls.DateJoin.setValue(item.DateJoin);
    this.form.controls.PhoneNo.setValue(item.PhoneNo);
    this.form.controls.ArticleNo.setValue(item.ArticleNo);
    this.form.controls.PermanencyType.setValue(item.PermanencyType);
    this.form.controls.InsideBuilding.setValue(item.InsideBuilding);
    this.form.controls.AdvHousing.setValue(item.AdvHousing);
    this.form.controls.AdvMobile.setValue(item.AdvMobile);
    this.form.controls.AdvVehicle.setValue(item.AdvVehicle);
    this.form.controls.GenderId.setValue(item.GenderId);
    this.form.controls.MasterDepartmentId.setValue(item.MasterDepartmentId);
    this.form.controls.MasterJobDegreeId.setValue(item.MasterJobDegreeId);
    this.form.controls.MasterFunctionalGroupId.setValue(
      item.MasterFunctionalGroupId
    );
    this.form.controls.MasterDesignationId.setValue(item.MasterDesignationId);
    this.form.controls.MasterJobTitleId.setValue(item.MasterJobTitleId);
    this.form.controls.MasterJobDescriptionId.setValue(
      item.MasterJobDescriptionId
    );
    this.form.controls.MasterNationalityId.setValue(item.MasterNationalityId);
    this.form.controls.MasterBudgetTypeId.setValue(item.MasterBudgetTypeId);
    this.form.controls.MasterJobLevelId.setValue(item.MasterJobLevelId);
    this.form.controls.NextJobLevelId.setValue(item.NextJobLevelId);
    this.form.controls.NextJobLevelDate.setValue(item.NextJobLevelDate);
    this.form.controls.MasterGradeId.setValue(item.MasterGradeId);
    this.form.controls.CurrentGradeDate.setValue(item.CurrentGradeDate);
    this.form.controls.NextGradeId.setValue(item.NextGradeId);
    this.form.controls.NextGradeDate.setValue(item.NextGradeDate);
    this.form.controls.CurrentNoOfAllowances.setValue(
      item.CurrentNoOfAllowances
    );
    this.form.controls.NextNoOfAllowances.setValue(item.NextNoOfAllowances);
    this.form.controls.IsRetired.setValue(item.IsRetired);
    this.form.controls.MasterReasonForRetirementId.setValue(
      item.MasterReasonForRetirementId
    );
    this.form.controls.RevisedBy.setValue(item.RevisedBy);
    this.form.controls.DateRevised.setValue(item.DateRevised);
    this.form.controls.Notes.setValue(item.Notes);

    // let d = new MasterDepartment();
    // d.Id = item.MasterDepartmentId;
    // d.MasterSector = item.Sector;
    // d.MasterProgram = item.Program;
    // d.Description = item.MasterDepartment;

    // this.masterDataList.departmentList.push(d);

    // this.personalDataParams.selectedSector = item.Sector;
    // this.personalDataParams.selectedProgram = item.Program;

    // let fg = new MasterFunctionalGroup();
    // fg.Id = item.MasterFunctionalGroupId;
    // fg.Description = item.MasterFunctionalGroup;

    // this.masterDataList.functionalGroupList.push(fg);

    // let tit = new MasterJobTitle();
    // tit.Id = item.MasterJobTitleId;
    // tit.Description = item.MasterJobTitle;

    // this.masterDataList.jobTitleList.push(tit);

    // let des = new MasterDesignation();
    // des.Id = item.MasterDesignationId;
    // des.Description = item.MasterDesignation;

    // this.masterDataList.designationList.push(des);

    // let g = new MasterGrade();
    // g.Id = item.MasterGradeId;
    // g.Description = item.MasterGrade;

    // this.masterDataList.gradeList.push(g);

    // let jd = new MasterJobDegree();
    // jd.Id = item.MasterJobDegreeId;
    // jd.Description = item.MasterJobDegree;

    // this.masterDataList.jobDegreeList.push(jd);

    // let l = new MasterJobLevel();
    // l.Id = item.MasterJobLevelId;
    // l.Description = item.MasterJobLevel;

    // this.masterDataList.jobLevelList.push(l);
    // l = new MasterJobLevel();
    // l.Id = item.NextJobLevelId;
    // l.Description = item.NextJobLevel;

    // this.masterDataList.jobLevelList.push(l);

    // let desc = new MasterJobDescription();
    // desc.Id = item.MasterJobDescriptionId;
    // desc.Description = item.MasterJobDescription;

    // this.masterDataList.jobDescriptionList.push(desc);

    // let b = new MasterBudgetType();
    // b.Id = item.MasterBudgetTypeId;
    // b.Description = item.MasterBudgetType;

    // this.masterDataList.budgetTypeList.push(b);

    // let n = new MasterNationality();
    // n.Id = item.MasterNationalityId;
    // n.Description = item.MasterNationality;

    // this.masterDataList.nationalityList.push(n);

    // let gen = new Gender();
    // gen.Id = item.GenderId;
    // gen.Description = item.Gender;

    // this.masterDataList.genderList.push(gen);

    // if (item.AdvHousing) {
    //   this._AdvHousing = true;
    // } else {
    //   this._AdvHousing = false;
    // }

    // if (item.AdvMobile) {
    //   this._AdvMobile = true;
    // } else {
    //   this._AdvMobile = false;
    // }

    // if (item.AdvVehicle) {
    //   this._AdvVehicle = true;
    // } else {
    //   this._AdvVehicle = false;
    // }

    // if (item.InsideBuilding) {
    //   this._InsideBuilding = true;
    // } else {
    //   this._InsideBuilding = false;
    // }

    // if (item.IsRetired) {
    //   this._IsRetired = true;
    // } else {
    //   this._IsRetired = false;
    // }

    // if (item.PermanencyType == 1) {
    //   this._rdoBasic = true;
    // } else {
    //   this._rdoShift = false;
    // }

    if (item.DateJoin != null) {
      var dt = new Date(item.DateJoin);
      dt.setHours(dt.getHours() + 3);

      this.form.controls.DateJoin.setValue(
        new Date(dt).toISOString().split("T")[0]
      );
    }

    if (item.DateBirth != null) {
      var dt = new Date(item.DateBirth);
      dt.setHours(dt.getHours() + 3);

      this.form.controls.DateBirth.setValue(
        new Date(dt).toISOString().split("T")[0]
      );
    }

    if (item.NextJobLevelDate != null) {
      var dt = new Date(item.NextJobLevelDate);
      dt.setHours(dt.getHours() + 3);

      this.form.controls.NextJobLevelDate.setValue(
        new Date(dt).toISOString().split("T")[0]
      );
    }

    if (item.CurrentGradeDate != null) {
      var dt = new Date(item.CurrentGradeDate);
      dt.setHours(dt.getHours() + 3);

      this.form.controls.CurrentGradeDate.setValue(
        new Date(dt).toISOString().split("T")[0]
      );
    }

    if (item.NextGradeDate != null) {
      var dt = new Date(item.NextGradeDate);
      dt.setHours(dt.getHours() + 3);

      this.form.controls.NextGradeDate.setValue(
        new Date(dt).toISOString().split("T")[0]
      );
    }

    //this.modalService.open(dataModal);
    this.modalService.open(dataModal, { size: "xl", centered: false });
  }

  // openModal(dataModal: any, item: PersonalData) {
  //   this.form.reset();

  //   this.subDataParams = item;

  //   this.personalDataParams = new PersonalDataParams();
  //   this.modalService.open(dataModal);
  //   // this.modalService.open(dataModal, { size: "xl", centered: false });
  // }

  // openHistoryModal(historyModal: any, item: PersonalData) {
  //   this.form.reset();
  //   this.subDataParams = item;
  //   this.fetchData();
  //   //console.log(this.dataList);
  //   this.personalDataParams = new PersonalDataParams();
  //   //this.modalService.open(dataModal);
  //   this.modalService.open(historyModal, { size: "lg", centered: false });
  // }

  // removeHistory(item: PersonalAnnualEvaluation) {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You want to remove this? You won't be able to recover it",
  //     icon: "question",
  //     showCancelButton: true,
  //     confirmButtonColor: "#34c38f",
  //     cancelButtonColor: "#f46a6a",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then((result) => {
  //     if (result.value) {
  //       this.personalService.postRemovePersonalEvaluation(item).subscribe(
  //         (x) => {
  //           //console.log(x);
  //           Swal.fire(
  //             "Saved!",
  //             "Personal Evaluation data removed successfully.",
  //             "success"
  //           );

  //           this.modalService.dismissAll();
  //           this.formSubmit = false;
  //           this.isLoading = false;
  //         },
  //         (err) => {
  //           Swal.fire("Failed!", "Something went wrong.", "error");
  //           this.formSubmit = false;
  //           this.isLoading = false;
  //         }
  //       );
  //     } else {
  //       this.formSubmit = false;
  //       this.isLoading = false;
  //     }
  //   });
  // }

  updateAllMarked() {
    this.formSubmit = true;
    this.isLoading = true;

    // this.form.controls.PersonalDataId.setValue(this.bonusList);

    ////console.log(this.subDataParams);
    ////console.log(this.form);
    // if (this.form.valid) {
    ////console.log(this.form.value);

    Swal.fire({
      title: "Are you sure?",
      text: "You want to update all marked rows?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Yes, do it!",
    }).then((result) => {
      if (result.value) {
        let b: Bonus[] = [];

        this.checkedItems.forEach((e) => {
          let a = new Bonus();

          a.Amount = e.Amount;
          a.PersonalDataId = e.Id;
          a.Year = this.yearForm.value.Year;
          a.Note = "Automatically Calculated";

          b.push(a);
        });

        this.bonusService.postSaveBonus(b).subscribe(
          (x) => {
            //console.log(x);
            Swal.fire("Saved!", "Bonus data saved successfully.", "success");

            this.modalService.dismissAll();
            this.formSubmit = false;
            this.isLoading = false;

            this.yearForm.reset();
            this.dataList = [];
            this.checkedItems = [];
          },
          (err) => {
            Swal.fire("Failed!", "Something went wrong.", "error");
            this.formSubmit = false;
            this.isLoading = false;
          }
        );
      } else {
        this.formSubmit = false;
        this.isLoading = false;
      }
    });

    // let a = new MasterData();

    // a.Id = this.form.value.Id;
    // a.Code = this.form.value.Code;
    // a.Description = this.form.value.Description;
    // a.FkId1 = this.form.value.StartValue;
    // a.FkId2 = this.form.value.EndValue;
    // a.Active = true;

    // this.personalService.postPersonalData().subscribe(
    //   (res) => {
    //     //console.log(res);
    //     const Idx = this.dataList.map((item) => item.Id).indexOf(res.Id);

    //     let a; // = new MasterAnnualEvaluation();

    //     a.Active = res.Active;
    //     a.Code = res.Code;
    //     a.Description = res.Description;
    //     a.Id = res.Id;
    //     a.StartValue = res.FkId1;
    //     a.EndValue = res.FkId2;

    //     if (Idx == -1) {
    //       this.dataList.push(a);
    //     } else {
    //       this.dataList[Idx] = a;
    //     }
    //     this.dataList.sort((a, b) =>
    //       a.Description.localeCompare(b.Description)
    //     );

    //     this.modalService.dismissAll();
    //     this.formSubmit = false;
    //     this.isLoading = false;
    //   },
    //   (err) => {
    //     Swal.fire(
    //       "Failed!",
    //       "Something went wrong. Please check your data",
    //       "error"
    //     );

    //     this.formSubmit = false;
    //     this.isLoading = false;
    //   }
    // );
    // } else {
    //   this.formSubmit = false;
    //   this.isLoading = false;
    //   Swal.fire("Failed!", "Incomplete Data.", "error");
    // }
  }

  getParams($event) {
    // this.params = $event;
    // if (
    //   this.params.Name.length >= 3 ||
    //   this.params.CivilIdNo.length >= 3 ||
    //   this.params.FileNo.length >= 3
    // ) {
    //   this.isCollapsed = true;
    //   this.fetchPersonalData();
    // } else {
    //   Swal.fire(
    //     "warning!",
    //     "Please provide at least 1 option to filter. And provide at least 3 charactors for search.",
    //     "info"
    //   );
    // }
    // this.fetchData();
  }

  keyPressNumbers(event) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  trackByFn(index, item) {
    return item.id; // unique id corresponding to the item
  }
}
