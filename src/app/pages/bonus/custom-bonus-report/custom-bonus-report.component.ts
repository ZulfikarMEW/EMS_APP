import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { BonusService } from "src/app/core/services/bonus.service";
import { SystemfunctionService } from "src/app/core/services/systemfunction.service";
import Swal from "sweetalert2";
import {
  BonusReportParams,
  CustomBonusReportModel,
  CustomBonusReportSelection,
  ParamsBonusReport,
  VBonusReport,
} from "./custom-bonus-report-model";

@Component({
  selector: "app-custom-bonus-report",
  templateUrl: "./custom-bonus-report.component.html",
  styleUrls: ["./custom-bonus-report.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomBonusReportComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  breadCrumbItems: Array<{}>;
  params: ParamsBonusReport = new ParamsBonusReport();

  isCollapsed: boolean;

  columnNamesList: any = [];
  selectedColumnNamesList: CustomBonusReportModel[] = [];

  checkBoxForm: FormGroup;

  // masterDataList: MasterData[] = [];
  bonusDataList: VBonusReport[] = [];
  bonusData: VBonusReport = new VBonusReport();

  // dataList: MasterBudgetType[] = [];

  form: FormGroup;
  filterForm: FormGroup;
  formSubmit: boolean = false;

  isLoading: boolean = false;

  headers = [];
  tableObj = [];

  title: string = "";
  selectionSaveModel: CustomBonusReportSelection =
    new CustomBonusReportSelection();

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private systemFunction: SystemfunctionService,
    private bonusService: BonusService,
    private cf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Reports" },
      { label: "Custom Bonus Report", active: true },
    ];

    this.form = this.fb.group({
      Id: [""],
      Code: ["", [Validators.required]],
      Description: ["", [Validators.required]],
    });

    this.filterForm = this.fb.group({
      YearFrom: [""],
      YearTo: [""],
      Amount: [""],
      Note: [""],
      Type: [""],
      PersonalDataId: [""],
      Name: [""],
      FileNo: [""],
      CivilIdNo: [""],
      DateBirth: [""],
      DateJoin: [""],
      PhoneNo: [""],
      ArticleNo: [""],
      MasterDepartmentId: [""],
      MasterDepartment: [""],
      Sector: [""],
      Program: [""],
      GenderId: [""],
      Gender: [""],
      ArabicDescription: [""],
      PermanencyType: [""],
      InsideBuilding: [""],
      AdvHousing: [""],
      AdvMobile: [""],
      AdvVehicle: [""],
      MasterFunctionalGroupId: [""],
      MasterFunctionalGroup: [""],
      MasterDesignationId: [""],
      MasterDesignation: [""],
      MasterJobTitleId: [""],
      MasterJobTitle: [""],
      MasterJobDescriptionId: [""],
      MasterJobDescription: [""],
      MasterNationalityId: [""],
      MasterNationality: [""],
      MasterJobDegreeId: [""],
      MasterJobDegree: [""],
      MasterBudgetTypeId: [""],
      MasterBudgetType: [""],
      MasterJobLevelId: [""],
      MasterJobLevel: [""],
      NextJobLevelId: [""],
      NextJobLevel: [""],
      NextJobLevelDate: [""],
      MasterGradeId: [""],
      MasterGrade: [""],
      CurrentGradeDate: [""],
      NextGradeId: [""],
      NextGrade: [""],
      NextGradeDate: [""],
      CurrentNoOfAllowances: [""],
      NextNoOfAllowances: [""],
      RevisedBy: [""],
      DateRevised: [""],
      IsRetired: [""],
      MasterReasonForRetirementId: [""],
      // Name: [""],
      // FileNo: [""],
      // CivilIdNo: [""],
      // DateBirth: [""],
      // DateJoin: [""],
      // PhoneNo: [""],
      // ArticleNo: [""],
      // PermanencyType: [""],
      // InsideBuilding: [""],
      // AdvHousing: [""],
      // AdvMobile: [""],
      // AdvVehicle: [""],
      // GenderId: [""],
      // MasterDepartmentId: [""],
      // MasterJobDegreeId: [""],
      // MasterFunctionalGroupId: [""],
      // MasterDesignationId: [""],
      // MasterJobTitleId: [""],
      // MasterJobDescriptionId: [""],
      // MasterNationalityId: [""],
      // MasterBudgetTypeId: [""],
      // MasterReasonForPromotionId: [""],
      // MasterJobLevelId: [""],
      // NextJobLevelId: [""],
      // NextJobLevelDate: [""],
      // MasterGradeId: [""],
      // NextGradeId: [""],
      // IsRetired: [""],
      // MasterReasonForRetirementId: [""],
      // Notes: [""],
    });

    this.checkBoxForm = this.fb.group({
      ColumnName: ["", [Validators.required]],
    });

    this.fetchData();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
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
    //this.cdr.detach();
    ////console.log(this.columnNamesList);
  }

  get f() {
    return this.form.controls;
  }

  fetchData() {
    this.isLoading = true;

    this.systemFunction
      .getColumnsList("V_BonusReport")
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        // Store the data
        Object.assign(this.columnNamesList, data);
        //console.log(this.columnNamesList);

        const FormControlObject = {};
        this.columnNamesList.forEach((res) => {
          FormControlObject[res.ColumnName] = new FormControl(false);
        });
        this.checkBoxForm = this.fb.group(FormControlObject);

        this.isLoading = false;

        this.cf.markForCheck();
        // this.columnNamesList.push(this._columnNamesList);
      });
  }

  // openEditModal(dataModal: any, item: MasterBudgetType) {
  //   this.form.reset();

  //   this.form.controls.Id.setValue(item.Id);
  //   this.form.controls.Description.setValue(item.Description);
  //   this.form.controls.Code.setValue(item.Code);

  //   this.modalService.open(dataModal);
  // }

  // openModal(dataModal: any) {
  //   this.form.reset();
  //   this.modalService.open(dataModal);
  // }

  // onSubmit() {
  //   this.formSubmit = true;
  //   this.isLoading = true;
  //   if (this.form.valid) {
  //     let a = new MasterData();

  //     a.Id = this.form.value.Id;
  //     a.Code = this.form.value.Code;
  //     a.Description = this.form.value.Description;
  //     a.Active = true;

  //     this.masterService.postMasterData(5, a).subscribe(
  //       (res) => {
  //         //console.log(res);
  //         const Idx = this.dataList.map((item) => item.Id).indexOf(res.Id);

  //         if (Idx == -1) {
  //           this.dataList.push(res);
  //         } else {
  //           this.dataList[Idx] = res;
  //         }
  //         this.dataList.sort((a, b) =>
  //           a.Description.localeCompare(b.Description)
  //         );

  //         this.modalService.dismissAll();
  //         this.formSubmit = false;
  //         this.isLoading = false;
  //       },
  //       (err) => {
  //         Swal.fire(
  //           "Failed!",
  //           "Something went wrong. Please check your data",
  //           "error"
  //         );

  //         this.formSubmit = false;
  //         this.isLoading = false;
  //       }
  //     );
  //   } else {
  //     this.formSubmit = false;
  //     this.isLoading = false;
  //   }
  // }

  trackByFn(index, item) {
    return item.id; // unique id corresponding to the item
  }

  getParams($event) {
    this.params = $event;

    if (
      this.params.Name.length >= 3 ||
      this.params.CivilIdNo.length >= 3 ||
      this.params.FileNo.length >= 3
    ) {
      this.isCollapsed = true;
      this.fetchBonusData();
    } else {
      Swal.fire(
        "warning!",
        "Please provide at least 1 option to filter. And provide at least 3 charactors for search.",
        "info"
      );
    }
    // this.fetchData();
  }

  reportParams: BonusReportParams = new BonusReportParams();

  onSubmitFilter() {
    //console.log(this.filterForm.value);
    this.params.Name = this.filterForm.value.Name;
    this.params.FileNo = this.filterForm.value.FileNo;
    this.params.CivilIdNo = this.filterForm.value.CivilIdNo;
    this.params.YearFrom = this.filterForm.value.YearFrom;
    this.params.YearTo = this.filterForm.value.YearTo;

    this.printTime = new Date();

    if (this.selectedColumnNamesList.length > 0) {
      if (this.title.trim() != "") {
        if (
          // this.params.Name.length >= 3 ||
          // this.params.CivilIdNo.length >= 3 ||
          // this.params.FileNo.length >= 3 ||
          this.params.YearFrom.toString.length < 4 ||
          this.params.YearTo.toString.length < 4
        ) {
          this.isCollapsed = true;

          this.reportParams.columnLists = this.selectedColumnNamesList;
          this.reportParams.bonusData = this.params;

          this.fetchReportData();
        } else {
          Swal.fire(
            "warning!",
            "Please specify for which year you want to generate report.",
            "info"
          );
        }
      } else {
        Swal.fire(
          "warning!",
          "Please provide a suitable title for the report.",
          "info"
        );
      }
    } else {
      Swal.fire("warning!", "Please at least one column to display.", "info");
    }
  }

  fetchReportData() {
    var startTime = performance.now();
    this.isLoading = true;
    this.bonusDataList = [];

    this.bonusService.postGetReportData(this.params).subscribe(
      (x) => {
        var startTime = performance.now();
        Object.assign(this.bonusDataList, x);

        this.isLoading = false;

        this.selectedColumnNamesList = this.selectedColumnNamesList.sort(
          (x) => x.currentTimeStamp
        );

        let xlist = [];
        this.selectedColumnNamesList.forEach((x) => {
          xlist.push(x.columnName);
        });

        // var listWithoutTel = this.personalDataList.map(
        //   ({ Name, ...item }) => item
        // );

        const res = this.bonusDataList.map((data) =>
          xlist.reduce((o, k) => ((o[k] = data[k]), o), {})
        );

        this.tableObj = res;

        this.tableObj.map((item) => {
          this.headers = Object.keys(item);
        });

        this.cf.markForCheck();
        var endTime = performance.now();

        console.log(((endTime - startTime) * 0.001).toFixed(2));

        Swal.fire(
          this.bonusDataList.length +
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

  getData(item) {
    return Object.keys(item);
  }

  fetchBonusData() {
    var startTime = performance.now();
    this.isLoading = true;
    this.bonusDataList = [];

    let a: { selection: any; params: any } = {
      selection: this.columnNamesList,
      params: this.params,
    };

    this.bonusService.postGetBonusData(this.bonusData).subscribe(
      (x) => {
        Object.assign(this.bonusDataList, x);

        this.isLoading = false;
        var endTime = performance.now();

        Swal.fire(
          this.bonusDataList.length +
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

  setValue(event) {
    let b = this.selectedColumnNamesList.filter(
      (x) => x.columnName == event.target.id
    );

    let a: CustomBonusReportModel = new CustomBonusReportModel();

    a.currentTimeStamp = Date.now();
    a.columnName = event.target.id;

    if (b.length == 0 && event.target.checked) {
      this.selectedColumnNamesList.push(a);
    } else if (b.length != 0 && !event.target.checked) {
      this.selectedColumnNamesList.forEach((element, index) => {
        if (element.columnName == a.columnName)
          this.selectedColumnNamesList.splice(index, 1);
      });
    }
  }

  saveSelection() {
    this.selectionSaveModel.ReportSection = "Bonus";
    this.selectionSaveModel.ReportTitle = this.title;

    if (this.selectedColumnNamesList.length > 0 && this.title.trim() != "") {
      if (this.selectionSaveModel.Name == null) {
        Swal.fire({
          title: "Please enter a name for the selection",
          input: "text",
          inputAttributes: {
            autocapitalize: "off",
          },
          showCancelButton: true,
          confirmButtonText: "Save",
          showLoaderOnConfirm: true,
          preConfirm: (name: string) => {
            if (name.trim() != "") {
              this.selectionSaveModel.Selection = JSON.stringify(
                this.selectedColumnNamesList
              );

              this.selectionSaveModel.Name = name;

              this.bonusService
                .PostSaveSelection(this.selectionSaveModel)
                .subscribe(
                  (x) => {
                    //Object.assign(this.personalDataList, x);

                    this.isLoading = false;
                    var endTime = performance.now();

                    this.selectionSaveModel = new CustomBonusReportSelection();

                    Swal.fire(
                      "Saved!",
                      "Selection saved successfully.",
                      "success"
                    );
                    // this.selectedColumnNamesList =
                    //   this.selectedColumnNamesList.sort((x) => x.currentTimeStamp);
                  },
                  (err) => {
                    Swal.fire("Failed!", "Something went wrong.", "error");

                    this.isLoading = false;
                  }
                );
            } else {
              Swal.fire(
                "Failed to save!",
                "Please provide a name and save again.",
                "error"
              );
            }
            // return fetch(`//api.github.com/users/${login}`)
            //   .then((response) => {
            //     if (!response.ok) {
            //       throw new Error(response.statusText);
            //     }
            //     return response.json();
            //   })
            //   .catch((error) => {
            //     Swal.showValidationMessage(`Request failed: ${error}`);
            //   });
          },
          allowOutsideClick: () => false, // !Swal.isLoading(),
        });
      } else {
        this.selectionSaveModel.Selection = JSON.stringify(
          this.selectedColumnNamesList
        );

        this.bonusService.PostSaveSelection(this.selectionSaveModel).subscribe(
          (x) => {
            //Object.assign(this.personalDataList, x);

            this.isLoading = false;
            var endTime = performance.now();

            this.selectionSaveModel = new CustomBonusReportSelection();

            Swal.fire("Saved!", "Selection saved successfully.", "success");
            // this.selectedColumnNamesList =
            //   this.selectedColumnNamesList.sort((x) => x.currentTimeStamp);
          },
          (err) => {
            Swal.fire("Failed!", "Something went wrong.", "error");

            this.isLoading = false;
          }
        );
      }
      // .then((result) => {
      //   if (result.isConfirmed) {
      //     Swal.fire({
      //       title: `${result.value.login}'s avatar`,
      //       imageUrl: result.value.avatar_url,
      //     });
      //   }
      // })
    } else {
      Swal.fire(
        "Failed!",
        "Please select columns and suitable title for the report before save.",
        "error"
      );
    }
  }

  selectionList: any;

  fetchReportSelection() {
    var startTime = performance.now();
    this.isLoading = true;
    this.selectionList = [];

    this.bonusService.getSavedSelection().subscribe(
      (x) => {
        Object.assign(this.selectionList, x);

        this.isLoading = false;
        var endTime = performance.now();
      },
      (err) => {
        Swal.fire("Failed!", "Something went wrong.", "error");

        this.isLoading = false;
      }
    );
  }

  changeReportSelection(event) {
    this.selectionSaveModel = event;

    this.selectedColumnNamesList = JSON.parse(
      this.selectionSaveModel.Selection
    );

    this.title = this.selectionSaveModel.ReportTitle;

    this.checkBoxForm.reset();

    this.selectedColumnNamesList.forEach((e) => {
      // this.checkBoxForm.controls[e].setValue(true);
      // this.checkBoxForm.patchValue({ e.columnName: true });

      this.checkBoxForm.controls[e.columnName].setValue(true);
    });
  }

  deleteSelection() {
    if (this.selectionSaveModel.Name != null) {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this template?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.value) {
          this.bonusService
            .PostDeleteSelection(this.selectionSaveModel)
            .subscribe(
              (res) => {
                Swal.fire("Saved!", "Template has been deleted.", "success");

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
  }

  printTime;
  displayOnly: boolean = true;

  print() {
    this.displayOnly = false;
    this.printNew();
  }

  printNew() {
    if (this.tableObj.length > 0) {
      let styleElement = document.getElementById("printableArea");
      styleElement.append("@media print { @page { size: A4 landscape; } }");
    }
    this.displayOnly = true;
  }
}
