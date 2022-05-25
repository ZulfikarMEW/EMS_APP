import { Component, EventEmitter, OnInit } from "@angular/core";
import { SystemfunctionService } from "src/app/core/services/systemfunction.service";
import { UserProfileService } from "src/app/core/services/user.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

import Swal from "sweetalert2";
import { LeaveService } from "src/app/core/services/leave.service";
import { RoleFunction } from "src/app/core/models/RoleFunction";
import { MasterData } from "../../masters/MasterData";
import { BonusService } from "src/app/core/services/bonus.service";
import { VBonusAmountMapping } from "./VBonusAmountMapping";
import { BonusAmountMapping } from "./BonusAmountMapping";

declare var $;

@Component({
  selector: "app-bonusamountmapping",
  templateUrl: "./bonusamountmapping.component.html",
  styleUrls: ["./bonusamountmapping.component.scss"],
})
export class BonusamountmappingComponent implements OnInit {
  // bread crumb items

  breadCrumbItems: Array<{}>;
  event: EventEmitter<any> = new EventEmitter();

  modalTitle: string = "";

  userAccess: RoleFunction[] = [];
  hasViewAccess: boolean = false;
  hasAddAccess: boolean = false;
  hasEditAccess: boolean = false;
  hasDeleteAccess: boolean = false;
  userAccessFiltered: RoleFunction = new RoleFunction();

  masterDataList: MasterData[] = [];
  selectedMasterDataList: MasterData[] = [];
  selectedDataList: MasterData[] = [];
  notSelectedDataList: MasterData[] = [];

  masterJobList: MasterData[] = [];
  selectedMasterJobList: MasterData[] = [];

  masterGradeList: MasterData[] = [];
  selectedMasterGradeList: MasterData[] = [];

  selectedMappingList: VBonusAmountMapping[] = [];
  isLoading: boolean = false;
  notSelectedDataListForDisplay: MasterData[] = [];

  constructor(
    private fb: FormBuilder,
    private systemFunction: SystemfunctionService,
    private userService: UserProfileService,
    private leaveService: LeaveService,
    private modalService: NgbModal,
    private bonusService: BonusService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Bonus" },
      { label: "Bonus Amount Mapping", active: true },
    ];

    this.isLoading = true;

    this.bonusService.getMasterMappingData().subscribe(
      (res) => {
        Object.assign(this.masterDataList, res);

        this.masterJobList = this.masterDataList.filter(
          (x) => x.Code == "JobTitle"
        );
        this.masterGradeList = this.masterDataList.filter(
          (x) => x.Code == "Grade"
        );

        this.masterJobList.sort((a, b) =>
          a.Description.localeCompare(b.Description)
        );
        this.masterGradeList.sort((a, b) =>
          a.Description.localeCompare(b.Description)
        );
      },
      (err) => {
        Swal.fire(
          "Failed!",
          "Something went wrong. Please check your data.",
          "error"
        );
      }
    );

    this.userService.getUserRoleFunction().subscribe((res: any) => {
      Object.assign(this.userAccess, res.RoleFunctions);

      this.userAccessFiltered = this.userAccess.find(
        (t) => t.SystemRoleFunctionId == 8
      );

      if (this.userAccessFiltered != null) {
        this.hasViewAccess = this.userAccessFiltered.AllowView;
        this.hasAddAccess = this.userAccessFiltered.AllowAdd;
        this.hasEditAccess = this.userAccessFiltered.AllowEdit;
        this.hasDeleteAccess = this.userAccessFiltered.AllowDelete;
      }
    });

    this.loadMappedData();

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

    // this.systemFunction.getSystemGenderList().subscribe((x) => {
    //   Object.assign(this.genderList, x);
    // });
    this.isLoading = false;
  }

  loadMappedData() {
    this.bonusService.getMappedData().subscribe(
      (res) => {
        Object.assign(this.selectedMappingList, res);

        console.log(this.selectedMappingList);
      },
      (err) => {
        Swal.fire(
          "Failed!",
          "Something went wrong. Please check your data.",
          "error"
        );
      }
    );
  }

  selectedItems = [];
  selectedAmount = 0;
  selectedType;

  onChangeType(type) {
    this.selectedDataList = [];
    this.notSelectedDataList = [];

    let selectedIds: number[] = [];

    this.selectedItems = [];

    this.selectedType = type.target.value;

    if (type.target.value == 1) {
      this.selectedDataList = this.masterJobList;

      selectedIds = this.selectedMappingList
        .filter((x) => x.Type == "JobTitle")
        .map(({ EntityId }) => EntityId);

      // myArray = myArray.filter((el) => !toRemove.includes(el));
    } else if (type.target.value == 2) {
      this.selectedDataList = this.masterGradeList;

      selectedIds = this.selectedMappingList
        .filter((x) => x.Type == "Grade")
        .map(({ EntityId }) => EntityId);

      console.log(selectedIds);
      // myArray = myArray.filter((el) => !toRemove.includes(el));
    }

    this.notSelectedDataList = this.selectedDataList;

    selectedIds.forEach((e) => {
      this.notSelectedDataList.forEach((value, index) => {
        if (value.Id == e) this.notSelectedDataList.splice(index, 1);
      });

      // const index = this.notSelectedDataList.indexOf(e, 0);
      // if (index > -1) {
      //   myArray.splice(index, 1);
      // }
    });

    this.notSelectedDataListForDisplay = this.notSelectedDataList;
    console.log(this.selectedDataList);
    console.log(this.notSelectedDataList);
    // this.masterJobList = this.masterDataList.filter((x) => (x.Code = "Job"));
    // this.masterGradeList = this.masterDataList.filter((x) => (x.Code = "Grade"));

    // this.masterJobList.sort((a, b) => a.Description.localeCompare(b.Description));
    // this.masterGradeList.sort((a, b) => a.Description.localeCompare(b.Description));
  }

  chooseData(event) {
    console.log(event);
    this.notSelectedDataListForDisplay = this.notSelectedDataList.filter(
      (el) => !event.includes(el)
    );
  }

  addMapping() {
    if (this.selectedAmount <= 0) {
      Swal.fire("Failed!", "Invalid Amount.", "error");
      return;
    }

    this.isLoading = true;

    Swal.fire({
      title: "Are you sure?",
      text: "You want to add mapping?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Yes, add it!",
    }).then((result) => {
      if (result.value) {
        let a: BonusAmountMapping[] = [];

        this.selectedItems.forEach((x) => {
          let b: BonusAmountMapping = new BonusAmountMapping();

          b.Amount = this.selectedAmount;
          b.BonusEntityTypeId = this.selectedType;
          b.EntityId = x;

          a.push(b);
        });

        this.bonusService.addMappedData(a).subscribe(
          (res) => {
            this.selectedMappingList = res;
            this.isLoading = false;
            Swal.fire("Success!", "Mapping data added.", "success");

            this.selectedType = 0;
            this.selectedDataList = [];
            this.notSelectedDataList = [];
            this.selectedItems = [];
          },
          (err) => {
            Swal.fire("Failed!", "Something went wrong.", "error");
            this.isLoading = false;
          }
        );

        // this.bonusService.removeMappedData(item.Id).subscribe(
        //   (x) => {
        //     Swal.fire("Saved!", "Bonus mapping data removed.", "success");
        //     this.selectedMappingList.splice(
        //       this.selectedMappingList.indexOf(item),
        //       1
        //     );
        //     this.isLoading = false;
        //   },
        //   (err) => {
        //     Swal.fire("Failed!", "Something went wrong.", "error");
        //     this.isLoading = false;
        //   }
        // );
      } else {
        // console.log(this.selectedItems);
        this.isLoading = false;
      }
    });
  }

  removeMapping(item) {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to remove?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.value) {
        // let a = new BonusAmountMapping();

        // a.Id = this.form.value.Id;
        // a.PersonalDataId = this.subDataParams.Id; //this.form.value.PersonalDataId;
        // a.MasterQualificationId = this.form.value.MasterQualificationId;
        // a.DateQualified = this.form.value.DateQualified;
        // a.Note = this.form.value.Note;

        this.bonusService.removeMappedData(item.Id).subscribe(
          (x) => {
            Swal.fire("Saved!", "Bonus mapping data removed.", "success");

            this.selectedMappingList.splice(
              this.selectedMappingList.indexOf(item),
              1
            );

            this.isLoading = false;
          },
          (err) => {
            Swal.fire("Failed!", "Something went wrong.", "error");
            this.isLoading = false;
          }
        );
      } else {
        this.isLoading = false;
      }
    });
  }

  selectEntity(data) {
    const targetIdx1 = this.selectedMasterDataList
      .map((item) => item)
      .indexOf(data);
    const targetIdx2 = this.masterDataList.map((item) => item).indexOf(data);

    if (targetIdx1 < 0) {
      this.selectedMasterDataList.push(data);
    } else {
      this.selectedMasterDataList.splice(targetIdx1, 1);
    }

    if (targetIdx2 < 0) {
      this.masterDataList.push(data);
    } else {
      this.masterDataList.splice(targetIdx2, 1);
    }

    // this.masterDataList.sort(
    //   (a, b) =>
    //     a.Code.localeCompare(b.Code) &&
    //     a.Description.localeCompare(b.Description)
    // );
    // this.selectedMasterDataList.sort(
    //   (a, b) =>
    //     a.Code.localeCompare(b.Code) &&
    //     a.Description.localeCompare(b.Description)
    // );
  }

  onChangeFilterParams() {
    // this.loading = true;
    // //console.log(this.employeeParams);
    // this.employeeList = [];
    // this.userService.getUsersList(this.employeeParams).subscribe((x) => {
    //   Object.assign(this.employeeList, x);
    //   this.employeeList.sort((a, b) => a.Name.localeCompare(b.Name));
    //   this.loading = false;
    //   ////console.log(this.employeeList);
    //   //this.filterBranch();
    // });
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
    // this.editMode = false;
    // this.employeeForm.reset();
    // this.modalTitle = "New Employee";
    // this.modalService.open(newDataModal, { size: "lg", centered: false });
    // // this.modalService.open(newDataModal);
  }

  trackByFn(index, item) {
    return item.id; // unique id corresponding to the item
  }
}
