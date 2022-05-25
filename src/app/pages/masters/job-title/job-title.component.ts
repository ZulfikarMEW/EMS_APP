import { Component, EventEmitter, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MastersService } from "src/app/core/services/masters.service";
import Swal from "sweetalert2";
import { MasterFunctionalGroup } from "../functional-group/MasterFunctionalGroup";
import { MasterData } from "../MasterData";
import { MasterJobTitle } from "./MasterJobTitle";

@Component({
  selector: "app-job-title",
  templateUrl: "./job-title.component.html",
  styleUrls: ["./job-title.component.scss"],
})
export class JobTitleComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  event: EventEmitter<any> = new EventEmitter();

  masterDataList: MasterData[] = [];
  masterSubDataList: MasterData[] = [];
  dataList: MasterJobTitle[] = [];
  functionalGroupList: MasterFunctionalGroup[] = [];

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
      { label: "Job Title", active: true },
    ];

    this.form = this.fb.group({
      Id: [""],
      Code: ["", [Validators.required]],
      Description: ["", [Validators.required]],
      MasterFunctionalGroupId: ["", [Validators.required]],
    });

    this.fetchData();
  }

  get f() {
    return this.form.controls;
  }

  fetchData() {
    this.isLoading = true;
    this.masterService.getMasterDataList(20, null).subscribe(
      (x) => {
        Object.assign(this.masterDataList, x);

        this.dataList = [];

        this.masterDataList.forEach((x) => {
          let a = new MasterJobTitle();

          a.Active = x.Active;
          a.Code = x.Code;
          a.Description = x.Description;
          a.Id = x.Id;
          a.MasterFunctionalGroupId = x.FkId1;
          a.MasterFunctionalGroup = x.FkDesc1;

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
    this.masterService.getMasterDataList(4, null).subscribe(
      (x) => {
        Object.assign(this.masterSubDataList, x);

        const newArray = this.masterSubDataList.map(
          ({ FkId1, FkId2, FkDesc1, FkDesc2, ...keepAttrs }) => keepAttrs
        );

        this.functionalGroupList = newArray;

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

  openEditModal(dataModal: any, item: MasterJobTitle) {
    this.form.reset();

    this.form.controls.Id.setValue(item.Id);
    this.form.controls.Description.setValue(item.Description);
    this.form.controls.Code.setValue(item.Code);
    this.form.controls.MasterFunctionalGroupId.setValue(
      item.MasterFunctionalGroupId
    );

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
      a.FkId1 = this.form.value.MasterFunctionalGroupId;
      a.FkDesc1 = this.selectedSubDataDescription;
      a.Active = true;

      this.masterService.postMasterData(20, a).subscribe(
        (res) => {
          console.log(res);
          const Idx = this.dataList.map((item) => item.Id).indexOf(res.Id);

          let a = new MasterJobTitle();

          a.Active = res.Active;
          a.Code = res.Code;
          a.Description = res.Description;
          a.Id = res.Id;
          a.MasterFunctionalGroupId = res.FkId1;
          a.MasterFunctionalGroup = res.FkDesc1;

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
