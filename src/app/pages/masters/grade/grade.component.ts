import { Component, EventEmitter, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MastersService } from "src/app/core/services/masters.service";
import Swal from "sweetalert2";
import { MasterJobDegree } from "../job-degree/MasterJobDegree";
import { MasterData } from "../MasterData";
import { MasterGrade } from "./MasterGrade";

@Component({
  selector: "app-grade",
  templateUrl: "./grade.component.html",
  styleUrls: ["./grade.component.scss"],
})
export class GradeComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  event: EventEmitter<any> = new EventEmitter();

  masterDataList: MasterData[] = [];
  masterSubDataList: MasterData[] = [];
  dataList: MasterGrade[] = [];
  jobDegreeList: MasterJobDegree[] = [];

  selectedSubDataDescription = "";

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
      { label: "Grade", active: true },
    ];

    this.form = this.fb.group({
      Id: [""],
      Code: ["", [Validators.required]],
      Description: ["", [Validators.required]],
      MasterJobDegreeId: ["", [Validators.required]],
    });

    this.fetchData();
  }

  get f() {
    return this.form.controls;
  }

  fetchData() {
    this.isLoading = true;
    this.masterService.getMasterDataList(2, null).subscribe(
      (x) => {
        Object.assign(this.masterDataList, x);

        this.dataList = [];

        this.masterDataList.forEach((x) => {
          let a = new MasterGrade();

          a.Active = x.Active;
          a.Code = x.Code;
          a.Description = x.Description;
          a.Id = x.Id;
          a.MasterJobDegreeId = x.FkId1;
          a.MasterJobDegree = x.FkDesc1;

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
    this.masterService.getMasterDataList(1, null).subscribe(
      (x) => {
        Object.assign(this.masterSubDataList, x);

        const newArray = this.masterSubDataList.map(
          ({ FkId1, FkId2, FkDesc1, FkDesc2, ...keepAttrs }) => keepAttrs
        );

        this.jobDegreeList = newArray;

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

  openEditModal(dataModal: any, item: MasterGrade) {
    this.form.reset();

    this.form.controls.Id.setValue(item.Id);
    this.form.controls.Description.setValue(item.Description);
    this.form.controls.Code.setValue(item.Code);
    this.form.controls.MasterJobDegreeId.setValue(item.MasterJobDegreeId);

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
      a.FkId1 = this.form.value.MasterJobDegreeId;
      a.FkDesc1 = this.selectedSubDataDescription;
      a.Active = true;

      this.masterService.postMasterData(2, a).subscribe(
        (res) => {
          console.log(res);
          const Idx = this.dataList.map((item) => item.Id).indexOf(res.Id);

          let a = new MasterGrade();

          a.Active = res.Active;
          a.Code = res.Code;
          a.Description = res.Description;
          a.Id = res.Id;
          a.MasterJobDegreeId = res.FkId1;
          a.MasterJobDegree = res.FkDesc1;

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

  onChangeJobDegree(event: Event) {
    this.selectedSubDataDescription =
      event.target["options"][event.target["options"].selectedIndex].text;
  }

  trackByFn(index, item) {
    return item.id; // unique id corresponding to the item
  }
}
