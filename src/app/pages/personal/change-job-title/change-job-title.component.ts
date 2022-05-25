import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MastersService } from "src/app/core/services/masters.service";
import { PersonalService } from "src/app/core/services/personal.service";
import Swal from "sweetalert2";
import { MasterJobTitle } from "../../masters/job-title/MasterJobTitle";
import { PersonalDataParams } from "../personal-data/personalDataParams";
import { PersonalData } from "../PersonalData";
import { PersonalChangeJobTitle } from "./PersonalChangeJobTitle";
import { VPersonalChangeJobTitle } from "./VPersonalChangeJobTitle";

@Component({
  selector: "app-change-job-title",
  templateUrl: "./change-job-title.component.html",
  styleUrls: ["./change-job-title.component.scss"],
})
export class ChangeJobTitleComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  params: PersonalData = new PersonalData();
  subDataParams: PersonalData = new PersonalData();
  // Collapse declare
  isCollapsed: boolean;

  dataList: VPersonalChangeJobTitle[] = [];
  historyDataList: VPersonalChangeJobTitle[] = [];

  masterData: MasterJobTitle[] = [];
  personalDataList: PersonalData[] = [];

  form: FormGroup;
  formSubmit: boolean = false;

  isLoading: boolean = false;
  personalDataParams: PersonalDataParams = new PersonalDataParams();

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private personalService: PersonalService,
    private masterService: MastersService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Personal Information" },
      { label: "Change Job Title", active: true },
    ];

    // Collapse value
    this.isCollapsed = false;

    this.form = this.fb.group({
      Id: [""],
      PersonalDataId: ["", [Validators.required]],
      MasterJobTitleId: ["", [Validators.required]],
      DateAffected: ["", [Validators.required]],
      Note: [""],
    });
  }

  get f() {
    return this.form.controls;
  }

  fetchData() {
    var startTime = performance.now();
    this.isLoading = true;
    this.dataList = [];

    this.personalService.postGetPersonalJobTitle(this.subDataParams).subscribe(
      (x) => {
        Object.assign(this.dataList, x);

        this.isLoading = false;
        var endTime = performance.now();

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

  fetchPersonalData() {
    var startTime = performance.now();
    this.isLoading = true;
    this.personalDataList = [];

    this.personalService.postGetPersonalData(this.params).subscribe(
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

  fetchMasterData() {
    if (this.masterData.length <= 0) {
      this.loadMasterList();
    }
    // if (opt != undefined) {
    //   if (opt == 12 && this.masterDataList.departmentList.length <= 2) {
    //     this.loadMasterList(opt);
    //   } else if (
    //     opt == 4 &&
    //     this.masterDataList.functionalGroupList.length <= 2
    //   ) {
    //     this.loadMasterList(opt);
    //   } else if (
    //     opt == 9 &&
    //     this.masterDataList.jobDescriptionList.length <= 2
    //   ) {
    //     this.loadMasterList(opt);
    //   } else if (opt == 6 && this.masterDataList.designationList.length <= 2) {
    //     this.loadMasterList(opt);
    //   } else if (opt == 1 && this.masterDataList.jobDegreeList.length <= 2) {
    //     this.loadMasterList(opt);
    //   } else if (opt == 2 && this.masterDataList.gradeList.length <= 2) {
    //     this.loadMasterList(opt);
    //   } else if (opt == 5 && this.masterDataList.budgetTypeList.length <= 2) {
    //     this.loadMasterList(opt);
    //   } else if (
    //     opt == 17 &&
    //     this.masterDataList.reasonForRetirementList.length <= 2
    //   ) {
    //     this.loadMasterList(opt);
    //   } else if (opt == 16 && this.masterDataList.nationalityList.length <= 2) {
    //     this.loadMasterList(opt);
    //   } else if (opt == 22 && this.masterDataList.genderList.length <= 2) {
    //     this.loadMasterList(opt);
    //   }
    // }
  }

  loadMasterList() {
    this.isLoading = true;

    this.masterData = [];
    // this.masterService.getMasterDataList(20, null).subscribe(
    this.personalService
      .postGetMasterJobTitleList(this.subDataParams)
      .subscribe(
        (x) => {
          Object.assign(this.masterData, x);
          console.log(this.masterData);
          this.isLoading = false;
        },
        (err) => {
          Swal.fire("Failed!", "Something went wrong.", "error");

          this.isLoading = false;
        }
      );
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

  openModal(dataModal: any, item: PersonalData) {
    this.form.reset();

    this.subDataParams = item;

    if (
      this.subDataParams.MasterFunctionalGroupId != item.MasterFunctionalGroupId
    ) {
      this.loadMasterList();
    }
    this.personalDataParams = new PersonalDataParams();
    this.modalService.open(dataModal);
    // this.modalService.open(dataModal, { size: "xl", centered: false });
  }

  openHistoryModal(historyModal: any, item: PersonalData) {
    this.form.reset();
    this.subDataParams = item;
    this.fetchData();

    this.personalDataParams = new PersonalDataParams();
    //this.modalService.open(dataModal);
    this.modalService.open(historyModal, { size: "lg", centered: false });
  }

  removeHistory(item: VPersonalChangeJobTitle) {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this? You won't be able to recover it",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this.personalService.postRemovePersonalJobTitle(item).subscribe(
          (x) => {
            console.log(x);
            Swal.fire(
              "Saved!",
              "Personal Job Title data removed successfully.",
              "success"
            );

            this.modalService.dismissAll();
            this.formSubmit = false;
            this.isLoading = false;
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
  }

  onSubmit() {
    this.formSubmit = true;
    this.isLoading = true;

    this.form.controls.PersonalDataId.setValue(this.subDataParams.Id);

    //console.log(this.subDataParams);
    //console.log(this.form);
    if (this.form.valid) {
      //console.log(this.form.value);

      Swal.fire({
        title: "Are you sure?",
        text: "You want to add this?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Yes, add it!",
      }).then((result) => {
        if (result.value) {
          let a = new PersonalChangeJobTitle();

          a.Id = this.form.value.Id;
          a.PersonalDataId = this.subDataParams.Id; //this.form.value.PersonalDataId;
          a.MasterJobTitleId = this.form.value.MasterJobTitleId;
          a.DateAffected = this.form.value.DateAffected;
          a.Note = this.form.value.Note;

          this.personalService.postSavePersonalJobTitle(a).subscribe(
            (x) => {
              console.log(x);
              Swal.fire(
                "Saved!",
                "Personal Job Title data saved successfully.",
                "success"
              );

              this.modalService.dismissAll();
              this.formSubmit = false;
              this.isLoading = false;
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
      //     console.log(res);
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
    } else {
      this.formSubmit = false;
      this.isLoading = false;
      Swal.fire("Failed!", "Incomplete Data.", "error");
    }
  }

  getParams($event) {
    this.params = $event;

    if (
      this.params.Name.length >= 3 ||
      this.params.CivilIdNo.length >= 3 ||
      this.params.FileNo.length >= 3
    ) {
      this.isCollapsed = true;
      this.fetchPersonalData();
    } else {
      Swal.fire(
        "warning!",
        "Please provide at least 1 option to filter. And provide at least 3 charactors for search.",
        "info"
      );
    }
    // this.fetchData();
  }

  trackByFn(index, item) {
    return item.id; // unique id corresponding to the item
  }
}
