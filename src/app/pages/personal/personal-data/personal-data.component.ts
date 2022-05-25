import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MastersService } from "src/app/core/services/masters.service";
import { PersonalService } from "src/app/core/services/personal.service";
import Swal from "sweetalert2";
import { MasterBudgetType } from "../../masters/budget-type/MasterBudgetType";
import { MasterDepartment } from "../../masters/department/Department";
import { MasterDesignation } from "../../masters/designation/MasterDesignation";
import { MasterFunctionalGroup } from "../../masters/functional-group/MasterFunctionalGroup";
import { Gender } from "../../masters/gender/Gender";
import { MasterGrade } from "../../masters/grade/MasterGrade";
import { MasterJobDegree } from "../../masters/job-degree/MasterJobDegree";
import { MasterJobDescription } from "../../masters/job-description/MasterJobDescription";
import { MasterJobLevel } from "../../masters/job-level/MasterJobLevel";
import { MasterJobTitle } from "../../masters/job-title/MasterJobTitle";
import { MasterData } from "../../masters/MasterData";
import { MasterNationality } from "../../masters/nationality/MasterNationality";
import { MasterReasonForRetirement } from "../../masters/reason-for-retirement/MasterReasonForRetirement";
import { PersonalData } from "../PersonalData";
import { MasterDataList } from "./MasterDataList";
import { PersonalDataParams } from "./personalDataParams";

@Component({
  selector: "app-personal-data",
  templateUrl: "./personal-data.component.html",
  styleUrls: ["./personal-data.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalDataComponent implements OnInit, AfterViewInit {
  breadCrumbItems: Array<{}>;
  params: PersonalData = new PersonalData();
  // Collapse declare
  isCollapsed: boolean;

  // masterDataList: MasterData[] = [];
  dataList: PersonalData[] = [];

  form: FormGroup;
  formSubmit: boolean = false;

  isLoading: boolean = false;
  genderList: MasterData[] = [];
  masterData: MasterData[] = [];

  masterDataList: MasterDataList = new MasterDataList();
  personalDataParams: PersonalDataParams = new PersonalDataParams();
  showRetirementReason: boolean = false;

  _rdoBasic: boolean = false;
  _rdoShift: boolean = false;
  _AdvHousing: boolean = false;
  _AdvMobile: boolean = false;
  _AdvVehicle: boolean = false;
  _InsideBuilding: boolean = false;
  _IsRetired: boolean = false;

  printTime;
  displayOnly: boolean = true;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private personalService: PersonalService,
    private masterService: MastersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Personal Information" },
      { label: "Personal Data", active: true },
    ];

    // Collapse value
    this.isCollapsed = false;

    this.form = this.fb.group({
      Id: [""],
      Name: ["", [Validators.required]],
      FileNo: ["", [Validators.required]],
      CivilIdNo: ["", [Validators.required]],
      DateBirth: [""],
      DateJoin: [""],
      PhoneNo: [""],
      ArticleNo: [""],
      PermanencyType: [1, [Validators.required]],
      InsideBuilding: [false, [Validators.required]],
      AdvHousing: [false, [Validators.required]],
      AdvMobile: [false, [Validators.required]],
      AdvVehicle: [false, [Validators.required]],
      GenderId: ["", [Validators.required]],
      MasterDepartmentId: ["", [Validators.required]],
      MasterJobDegreeId: ["", [Validators.required]],
      MasterFunctionalGroupId: ["", [Validators.required]],
      MasterDesignationId: ["", [Validators.required]],
      MasterJobTitleId: ["", [Validators.required]],
      MasterJobDescriptionId: ["", [Validators.required]],
      MasterNationalityId: ["", [Validators.required]],
      MasterBudgetTypeId: ["", [Validators.required]],
      MasterJobLevelId: ["", [Validators.required]],
      NextJobLevelId: [""],
      NextJobLevelDate: [""],
      MasterGradeId: ["", [Validators.required]],
      CurrentGradeDate: [""],
      NextGradeId: [""],
      NextGradeDate: [""],
      CurrentNoOfAllowances: ["0"],
      NextNoOfAllowances: ["0"],
      IsRetired: ["", [Validators.required]],
      MasterReasonForRetirementId: [""],
      RevisedBy: [""],
      DateRevised: [""],
      Notes: [""],
    });
  }

  ngAfterViewInit() {
    // Since we know the list is not going to change
    // let's request that this component not undergo change detection at all

    // Request a single pass of change detection for the application
    // this.cdr.markForCheck();

    // Request a single pass of change detection for just this component
    // this.cdr.detectChanges();

    // Connect this component back to the change detection process
    // this.cdr.reattach();

    this.cdr.detach();
  }

  get f() {
    return this.form.controls;
  }

  fetchData() {
    var startTime = performance.now();

    var today = new Date();
    var date =
      today.getDate() +
      "/" +
      ("0" + (today.getMonth() + 1)).slice(
        ("0" + (today.getMonth() + 1)).length - 2,
        ("0" + (today.getMonth() + 1)).length
      ) +
      "/" +
      today.getFullYear();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    this.printTime = new Date(); //date + " " + time;

    this.isLoading = true;
    this.dataList = [];

    console.log(this.params);

    this.personalService.postGetPersonalData(this.params).subscribe(
      (x) => {
        Object.assign(this.dataList, x);

        this.isLoading = false;
        var endTime = performance.now();

        this.cdr.detectChanges();

        Swal.fire(
          this.dataList.length +
            " record(s) found in " +
            ((endTime - startTime) * 0.001).toFixed(2) +
            " seconds."
        );
      },
      (err) => {
        Swal.fire("Failed!", "Something went wrong.", "error");

        this.isLoading = false;
      }
    );
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  fetchMasterData(opt) {
    // //console.log(this.masterDataList.jobDegreeList);
    // //console.log(this.masterDataList.designationList);

    if (opt != undefined) {
      if (opt == 12 && this.masterDataList.departmentList.length <= 2) {
        this.loadMasterList(opt);
      } else if (
        opt == 4 &&
        this.masterDataList.functionalGroupList.length <= 2
      ) {
        this.loadMasterList(opt);
      } else if (
        opt == 9 &&
        this.masterDataList.jobDescriptionList.length <= 2
      ) {
        this.loadMasterList(opt);
      } else if (opt == 6 && this.masterDataList.designationList.length <= 2) {
        this.loadMasterList(opt);
      } else if (opt == 1 && this.masterDataList.jobDegreeList.length <= 2) {
        this.loadMasterList(opt);
      } else if (opt == 2 && this.masterDataList.gradeList.length <= 2) {
        this.loadMasterList(opt);
      } else if (opt == 5 && this.masterDataList.budgetTypeList.length <= 2) {
        this.loadMasterList(opt);
      } else if (
        opt == 17 &&
        this.masterDataList.reasonForRetirementList.length <= 2
      ) {
        this.loadMasterList(opt);
      } else if (opt == 16 && this.masterDataList.nationalityList.length <= 2) {
        this.loadMasterList(opt);
      } else if (opt == 22 && this.masterDataList.genderList.length <= 2) {
        this.loadMasterList(opt);
      }
    }
  }

  loadMasterList(opt) {
    this.isLoading = true;

    this.masterData = [];
    this.masterService.getMasterDataList(opt, null).subscribe(
      (x) => {
        Object.assign(this.masterData, x);

        ////console.log(this.masterData);

        this.masterData.forEach((x) => {
          if (opt == 12) {
            let a = new MasterDepartment();

            a.Active = x.Active;
            a.Code = x.Code;
            a.Description = x.Description;
            a.Id = x.Id;
            a.MasterSectorId = x.FkId1;
            a.MasterSector = x.FkDesc1;
            a.MasterProgramId = x.FkId2;
            a.MasterProgram = x.FkDesc2;

            this.masterDataList.departmentList.push(a);
          } else if (opt == 4) {
            let a = new MasterFunctionalGroup();

            a.Active = x.Active;
            a.Code = x.Code;
            a.Description = x.Description;
            a.Id = x.Id;

            this.masterDataList.functionalGroupList.push(a);
          } else if (opt == 9) {
            let a = new MasterJobDescription();

            a.Active = x.Active;
            a.Code = x.Code;
            a.Description = x.Description;
            a.Id = x.Id;

            this.masterDataList.jobDescriptionList.push(a);
          } else if (opt == 6) {
            let a = new MasterDesignation();

            a.Active = x.Active;
            a.Code = x.Code;
            a.Description = x.Description;
            a.Id = x.Id;

            this.masterDataList.designationList.push(a);
          } else if (opt == 1) {
            let a = new MasterJobDegree();

            a.Active = x.Active;
            a.Code = x.Code;
            a.Description = x.Description;
            a.Id = x.Id;

            this.masterDataList.jobDegreeList.push(a);
          } else if (opt == 2) {
            let a = new MasterGrade();

            a.Active = x.Active;
            a.Code = x.Code;
            a.Description = x.Description;
            a.Id = x.Id;

            this.masterDataList.gradeList.push(a);
          } else if (opt == 5) {
            let a = new MasterBudgetType();

            a.Active = x.Active;
            a.Code = x.Code;
            a.Description = x.Description;
            a.Id = x.Id;

            this.masterDataList.budgetTypeList.push(a);
          } else if (opt == 17) {
            let a = new MasterReasonForRetirement();

            a.Active = x.Active;
            a.Code = x.Code;
            a.Description = x.Description;
            a.Id = x.Id;

            this.masterDataList.reasonForRetirementList.push(a);
          } else if (opt == 16) {
            let a = new MasterNationality();

            a.Active = x.Active;
            a.Code = x.Code;
            a.Description = x.Description;
            a.Id = x.Id;

            this.masterDataList.nationalityList.push(a);
          } else if (opt == 22) {
            let a = new Gender();

            a.ArabicDescription = x.Code;
            a.Description = x.Description;
            a.Id = x.Id;

            this.masterDataList.genderList.push(a);
            //console.log(this.masterDataList.genderList);
          }
        });

        ////console.log(this.departmentList);
        // this.dataList.sort((a, b) =>
        //   a.Description.localeCompare(b.Description)
        // );

        this.isLoading = false;
      },
      (err) => {
        Swal.fire("Failed!", "Something went wrong.", "error");

        this.isLoading = false;
      }
    );
  }

  changeMasterData(opt, id) {
    //console.log(id);
    if (id != undefined) {
      if (opt == 12) {
        this.personalDataParams.selectedProgram =
          this.masterDataList.departmentList.find(
            (t) => t.Id == id
          ).MasterProgram;
        this.personalDataParams.selectedSector =
          this.masterDataList.departmentList.find(
            (t) => t.Id == id
          ).MasterSector;
      } else if (opt == 4) {
        this.masterService.getMasterDataList(8, null).subscribe((b) => {
          this.masterData = [];
          this.masterDataList.jobLevelList = [];

          Object.assign(this.masterData, b);

          this.masterData
            .filter((c) => c.FkId1 == id)
            .forEach((z) => {
              let a = new MasterJobLevel();

              a.Active = z.Active;
              a.Code = z.Code;
              a.Description = z.Description;
              a.Id = z.Id;
              a.MasterFunctionalGroupId = z.FkId1;

              this.masterDataList.jobLevelList.push(a);
              //this.masterDataList.nextJobLevelList.push(a);
            });
        });

        this.masterService.getMasterDataList(20, null).subscribe((x) => {
          this.masterData = [];
          this.masterDataList.jobTitleList = [];

          Object.assign(this.masterData, x);

          this.masterData
            .filter((y) => y.FkId1 == id)
            .forEach((z) => {
              let a = new MasterJobTitle();

              a.Active = z.Active;
              a.Code = z.Code;
              a.Description = z.Description;
              a.Id = z.Id;
              a.MasterFunctionalGroupId = z.FkId1;

              this.masterDataList.jobTitleList.push(a);
            });
        });
      }
    }
  }

  detectCheckValue(event) {
    if (event.toString() == "true") {
      this.showRetirementReason = true;
    } else {
      this.showRetirementReason = false;
    }
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
    this.form.controls.MasterDepartmentId.disable();
    this.form.controls.MasterJobDegreeId.setValue(item.MasterJobDegreeId);
    this.form.controls.MasterJobDegreeId.disable();
    this.form.controls.MasterFunctionalGroupId.setValue(
      item.MasterFunctionalGroupId
    );
    this.form.controls.MasterDesignationId.setValue(item.MasterDesignationId);
    this.form.controls.MasterJobTitleId.setValue(item.MasterJobTitleId);
    this.form.controls.MasterJobTitleId.disable();
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

    let d = new MasterDepartment();
    d.Id = item.MasterDepartmentId;
    d.MasterSector = item.Sector;
    d.MasterProgram = item.Program;
    d.Description = item.MasterDepartment;

    this.masterDataList.departmentList.push(d);

    this.personalDataParams.selectedSector = item.Sector;
    this.personalDataParams.selectedProgram = item.Program;

    let fg = new MasterFunctionalGroup();
    fg.Id = item.MasterFunctionalGroupId;
    fg.Description = item.MasterFunctionalGroup;

    this.masterDataList.functionalGroupList.push(fg);

    let tit = new MasterJobTitle();
    tit.Id = item.MasterJobTitleId;
    tit.Description = item.MasterJobTitle;

    this.masterDataList.jobTitleList.push(tit);

    let des = new MasterDesignation();
    des.Id = item.MasterDesignationId;
    des.Description = item.MasterDesignation;

    this.masterDataList.designationList.push(des);

    let g = new MasterGrade();
    g.Id = item.MasterGradeId;
    g.Description = item.MasterGrade;

    this.masterDataList.gradeList.push(g);

    let jd1 = new MasterJobDegree();
    jd1.Id = item.MasterJobDegreeId;
    jd1.Description = item.MasterJobDegree;

    this.masterDataList.jobDegreeList.push(jd1);

    let l = new MasterJobLevel();
    l.Id = item.MasterJobLevelId;
    l.Description = item.MasterJobLevel;

    this.masterDataList.jobLevelList.push(l);
    l = new MasterJobLevel();
    l.Id = item.NextJobLevelId;
    l.Description = item.NextJobLevel;

    this.masterDataList.jobLevelList.push(l);

    let desc = new MasterJobDescription();
    desc.Id = item.MasterJobDescriptionId;
    desc.Description = item.MasterJobDescription;

    this.masterDataList.jobDescriptionList.push(desc);

    let b = new MasterBudgetType();
    b.Id = item.MasterBudgetTypeId;
    b.Description = item.MasterBudgetType;

    this.masterDataList.budgetTypeList.push(b);

    let n = new MasterNationality();
    n.Id = item.MasterNationalityId;
    n.Description = item.MasterNationality;

    this.masterDataList.nationalityList.push(n);

    let gen = new Gender();
    gen.Id = item.GenderId;
    gen.Description = item.Gender;

    this.masterDataList.genderList.push(gen);

    if (item.AdvHousing) {
      this._AdvHousing = true;
    } else {
      this._AdvHousing = false;
    }

    if (item.AdvMobile) {
      this._AdvMobile = true;
    } else {
      this._AdvMobile = false;
    }

    if (item.AdvVehicle) {
      this._AdvVehicle = true;
    } else {
      this._AdvVehicle = false;
    }

    if (item.InsideBuilding) {
      this._InsideBuilding = true;
    } else {
      this._InsideBuilding = false;
    }

    if (item.IsRetired) {
      this._IsRetired = true;
    } else {
      this._IsRetired = false;
    }

    if (item.PermanencyType == 1) {
      this._rdoBasic = true;
    } else {
      this._rdoShift = false;
    }

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

  openModal(dataModal: any) {
    this.form.reset();
    this.form.controls.MasterJobDegreeId.enable();
    this.form.controls.MasterJobTitleId.enable();
    this.form.controls.MasterDepartmentId.enable();
    this.personalDataParams = new PersonalDataParams();
    //this.modalService.open(dataModal);
    this.modalService.open(dataModal, { size: "xl", centered: false });
  }

  onSubmit() {
    this.formSubmit = true;
    this.isLoading = true;

    if (
      (<HTMLInputElement>document.getElementById("AdvHousing")).checked &&
      (<HTMLInputElement>document.getElementById("AdvHousing")).value != null
    ) {
      this.form.controls.AdvHousing.setValue(true);
    } else {
      this.form.controls.AdvHousing.setValue(false);
    }

    if ((<HTMLInputElement>document.getElementById("AdvMobile")).checked) {
      this.form.controls.AdvMobile.setValue(true);
    } else {
      this.form.controls.AdvMobile.setValue(false);
    }

    if ((<HTMLInputElement>document.getElementById("AdvVehicle")).checked) {
      this.form.controls.AdvVehicle.setValue(true);
    } else {
      this.form.controls.AdvVehicle.setValue(false);
    }

    if ((<HTMLInputElement>document.getElementById("InsideBuilding")).checked) {
      this.form.controls.InsideBuilding.setValue(true);
    } else {
      this.form.controls.InsideBuilding.setValue(false);
    }

    if ((<HTMLInputElement>document.getElementById("retired")).checked) {
      this.form.controls.IsRetired.setValue(true);
    } else {
      this.form.controls.IsRetired.setValue(false);
    }

    if ((<HTMLInputElement>document.getElementById("rdoBasic")).checked) {
      this.form.controls.PermanencyType.setValue(1);
    } else if (
      (<HTMLInputElement>document.getElementById("rdoShift")).checked
    ) {
      this.form.controls.PermanencyType.setValue(2);
    } else {
      this.form.controls.PermanencyType.setValue(1);
    }

    ////console.log(this.form);
    if (this.form.valid) {
      //console.log(this.form.value);

      let a = new PersonalData();

      a.Id = this.form.value.Id;
      a.Name = this.form.value.Name;
      a.FileNo = this.form.value.FileNo;
      a.CivilIdNo = this.form.value.CivilIdNo;
      a.DateBirth = this.form.value.DateBirth;
      a.DateJoin = this.form.value.DateJoin;
      a.PhoneNo = this.form.value.PhoneNo;
      a.ArticleNo = this.form.value.ArticleNo;
      a.PermanencyType = this.form.value.PermanencyType;
      a.InsideBuilding = this.form.value.InsideBuilding;
      a.AdvHousing = this.form.value.AdvHousing;
      a.AdvMobile = this.form.value.AdvMobile;
      a.AdvVehicle = this.form.value.AdvVehicle;
      a.GenderId = this.form.value.GenderId;
      a.MasterDepartmentId = this.form.value.MasterDepartmentId;
      a.MasterJobDegreeId = this.form.value.MasterJobDegreeId;
      a.MasterFunctionalGroupId = this.form.value.MasterFunctionalGroupId;
      a.MasterDesignationId = this.form.value.MasterDesignationId;
      a.MasterJobTitleId = this.form.value.MasterJobTitleId;
      a.MasterJobDescriptionId = this.form.value.MasterJobDescriptionId;
      a.MasterNationalityId = this.form.value.MasterNationalityId;
      a.MasterBudgetTypeId = this.form.value.MasterBudgetTypeId;
      a.MasterJobLevelId = this.form.value.MasterJobLevelId;
      a.NextJobLevelId = this.form.value.NextJobLevelId;
      a.NextJobLevelDate = this.form.value.NextJobLevelDate;
      a.MasterGradeId = this.form.value.MasterGradeId;
      a.CurrentGradeDate = this.form.value.CurrentGradeDate;
      a.NextGradeId = this.form.value.NextGradeId;
      a.NextGradeDate = this.form.value.NextGradeDate;
      a.CurrentNoOfAllowances = this.form.value.CurrentNoOfAllowances;
      a.NextNoOfAllowances = this.form.value.NextNoOfAllowances;
      a.IsRetired = this.form.value.IsRetired;
      a.MasterReasonForRetirementId =
        this.form.value.MasterReasonForRetirementId;
      a.RevisedBy = this.form.value.RevisedBy;
      a.DateRevised = this.form.value.DateRevised;
      a.Notes = this.form.value.Notes;

      this.personalService.postSavePersonalData(a).subscribe(
        (x) => {
          //console.log(x);
          Swal.fire("Saved!", "Personal data saved successfully.", "success");

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
    } else {
      this.formSubmit = false;
      this.isLoading = false;
    }
  }

  getParams($event) {
    this.params = $event;

    if (
      this.params.Name.length >= 3 ||
      this.params.CivilIdNo.length >= 3 ||
      this.params.FileNo.length >= 3 //||
      // this.params.PhoneNo != "" ||
      // this.params.ArticleNo != null ||
      // this.params.GenderId != null ||
      // this.params.MasterDepartmentId != null ||
      // this.params.MasterJobDegreeId != null ||
      // this.params.MasterFunctionalGroupId != null ||
      // this.params.MasterDesignationId != null ||
      // this.params.MasterJobTitleId != null ||
      // this.params.MasterJobDescriptionId != null ||
      // this.params.MasterNationalityId != null ||
      // this.params.MasterBudgetTypeId != null ||
      // this.params.MasterJobLevelId != null ||
      // this.params.NextJobLevelId != null ||
      // this.params.NextJobLevelDate != null ||
      // this.params.MasterGradeId != null ||
      // this.params.CurrentGradeDate != null ||
      // this.params.NextGradeId != null ||
      // this.params.NextGradeDate != null ||
      // this.params.CurrentNoOfAllowances != null ||
      // this.params.NextNoOfAllowances != null ||
      // this.params.IsRetired != null ||
      // this.params.MasterReasonForRetirementId != null ||
      // this.params.RevisedBy != null ||
      // this.params.DateRevised != null ||
      // this.params.Notes != ""
    ) {
      this.printTime = new Date();
      this.isCollapsed = true;
      this.fetchData();
    } else {
      Swal.fire(
        "warning!",
        "Please provide at least 1 option to filter. And provide at least 3 charactors for search.",
        "info"
      );
    }
    // this.fetchData();
  }

  print() {
    this.displayOnly = false;
    this.printNew();
  }

  printNew() {
    if (this.dataList.length > 0) {
      let styleElement = document.getElementById("printableArea");
      styleElement.append("@media print { @page { size: A4 landscape; } }");
    }
    this.displayOnly = true;
  }

  // onChangeSector(event: Event) {
  //   this.selectedSubDataDescription =
  //     event.target["options"][event.target["options"].selectedIndex].text;
  // }

  // onChangeProgram(event: Event) {
  //   this.selectedSubDataDescription2 =
  //     event.target["options"][event.target["options"].selectedIndex].text;
  // }

  trackByFn(index, item) {
    return item.id; // unique id corresponding to the item
  }
}
