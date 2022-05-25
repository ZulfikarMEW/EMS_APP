import { Component, EventEmitter, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MastersService } from "src/app/core/services/masters.service";
import Swal from "sweetalert2";
import { MasterData } from "../MasterData";
import { MasterProgram } from "../program/MasterProgram";
import { MasterSector } from "../sector/MasterSector";
import { MasterDepartment } from "./Department";

@Component({
  selector: "app-department",
  templateUrl: "./department.component.html",
  styleUrls: ["./department.component.scss"],
})
export class DepartmentComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  event: EventEmitter<any> = new EventEmitter();

  masterDataList: MasterData[] = [];
  masterSubDataList: MasterData[] = [];
  masterSubDataList2: MasterData[] = [];
  dataList: MasterDepartment[] = [];
  sectorList: MasterSector[] = [];
  programList: MasterProgram[] = [];

  selectedSubDataDescription = "";
  selectedSubDataDescription2 = "";

  form: FormGroup;
  formSubmit: boolean = false;

  isLoading: boolean = false;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private masterService: MastersService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Masters" },
      { label: "Department", active: true },
    ];

    this.form = this.fb.group({
      Id: [""],
      Code: ["", [Validators.required]],
      Description: ["", [Validators.required]],
      MasterSectorId: ["", [Validators.required]],
      MasterProgramId: ["", [Validators.required]],
    });

    this.fetchData();
  }

  get f() {
    return this.form.controls;
  }

  fetchData() {
    this.isLoading = true;
    this.masterService.getMasterDataList(12, null).subscribe(
      (x) => {
        Object.assign(this.masterDataList, x);

        this.dataList = [];

        this.masterDataList.forEach((x) => {
          let a = new MasterDepartment();

          a.Active = x.Active;
          a.Code = x.Code;
          a.Description = x.Description;
          a.Id = x.Id;
          a.MasterSectorId = x.FkId1;
          a.MasterSector = x.FkDesc1;
          a.MasterProgramId = x.FkId2;
          a.MasterProgram = x.FkDesc2;

          this.dataList.push(a);
        });

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

    this.isLoading = true;
    this.masterService.getMasterDataList(11, null).subscribe(
      (x) => {
        Object.assign(this.masterSubDataList, x);

        const newArray = this.masterSubDataList.map(
          ({ FkId1, FkId2, FkDesc1, FkDesc2, ...keepAttrs }) => keepAttrs
        );

        this.sectorList = newArray;

        // this.jobDegreeList.sort((a, b) =>
        //   a.Description.localeCompare(b.Description)
        // );
        this.isLoading = false;
      },
      (err) => {
        Swal.fire("Failed!", "Something went wrong.", "error");

        this.isLoading = false;
      }
    );

    this.isLoading = true;
    this.masterService.getMasterDataList(10, null).subscribe(
      (x) => {
        Object.assign(this.masterSubDataList2, x);

        const newArray = this.masterSubDataList2.map(
          ({ FkId1, FkId2, FkDesc1, FkDesc2, ...keepAttrs }) => keepAttrs
        );

        this.programList = newArray;

        // this.jobDegreeList.sort((a, b) =>
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

  openEditModal(dataModal: any, item: MasterDepartment) {
    this.form.reset();

    this.form.controls.Id.setValue(item.Id);
    this.form.controls.Description.setValue(item.Description);
    this.form.controls.Code.setValue(item.Code);
    this.form.controls.MasterSectorId.setValue(item.MasterSectorId);
    this.form.controls.MasterProgramId.setValue(item.MasterProgramId);

    this.modalService.open(dataModal);
  }

  openModal(dataModal: any) {
    this.form.reset();
    this.modalService.open(dataModal);
  }

  onSubmit() {
    this.formSubmit = true;
    this.isLoading = true;
    if (this.form.valid) {
      let a = new MasterData();

      a.Id = this.form.value.Id;
      a.Code = this.form.value.Code;
      a.Description = this.form.value.Description;
      a.FkId1 = this.form.value.MasterSectorId;
      a.FkDesc1 = this.selectedSubDataDescription;
      a.FkId2 = this.form.value.MasterProgramId;
      a.FkDesc2 = this.selectedSubDataDescription2;
      a.Active = true;

      this.masterService.postMasterData(12, a).subscribe(
        (res) => {
          console.log(res);
          const Idx = this.dataList.map((item) => item.Id).indexOf(res.Id);

          let a = new MasterDepartment();

          a.Active = res.Active;
          a.Code = res.Code;
          a.Description = res.Description;
          a.Id = res.Id;
          a.MasterSectorId = res.FkId1;
          a.MasterSector = res.FkDesc1;
          a.MasterProgramId = res.FkId2;
          a.MasterProgram = res.FkDesc2;

          if (Idx == -1) {
            this.dataList.push(a);
          } else {
            this.dataList[Idx] = a;
          }
          this.dataList.sort((a, b) =>
            a.Description.localeCompare(b.Description)
          );

          this.modalService.dismissAll();
          this.formSubmit = false;
          this.isLoading = false;
        },
        (err) => {
          Swal.fire(
            "Failed!",
            "Something went wrong. Please check your data",
            "error"
          );

          this.formSubmit = false;
          this.isLoading = false;
        }
      );
    } else {
      this.formSubmit = false;
      this.isLoading = false;
    }
  }

  onChangeSector(event: Event) {
    this.selectedSubDataDescription =
      event.target["options"][event.target["options"].selectedIndex].text;
  }

  onChangeProgram(event: Event) {
    this.selectedSubDataDescription2 =
      event.target["options"][event.target["options"].selectedIndex].text;
  }

  trackByFn(index, item) {
    return item.id; // unique id corresponding to the item
  }
}
