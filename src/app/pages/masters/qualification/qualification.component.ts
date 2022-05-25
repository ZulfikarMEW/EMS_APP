import { Component, EventEmitter, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MastersService } from "src/app/core/services/masters.service";
import Swal from "sweetalert2";
import { MasterData } from "../MasterData";
import { MasterQualification } from "./MasterQualification";

@Component({
  selector: "app-qualification",
  templateUrl: "./qualification.component.html",
  styleUrls: ["./qualification.component.scss"],
})
export class QualificationComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  event: EventEmitter<any> = new EventEmitter();

  masterDataList: MasterData[] = [];
  dataList: MasterQualification[] = [];

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
      { label: "Qualification", active: true },
    ];

    this.form = this.fb.group({
      Id: [""],
      Code: ["", [Validators.required]],
      Description: ["", [Validators.required]],
    });

    this.fetchData();
  }

  get f() {
    return this.form.controls;
  }

  fetchData() {
    this.isLoading = true;
    console.log("start - " + new Date());
    this.masterService.getMasterDataList(3, null).subscribe(
      (x) => {
        Object.assign(this.masterDataList, x);
        console.log("Got - " + new Date());

        const newArray = this.masterDataList.map(
          ({ FkId1, FkId2, FkDesc1, FkDesc2, ...keepAttrs }) => keepAttrs
        );

        this.dataList = newArray;
        console.log("assigned - " + new Date());

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

  openEditModal(dataModal: any, item: MasterQualification) {
    this.form.reset();

    this.form.controls.Id.setValue(item.Id);
    this.form.controls.Description.setValue(item.Description);
    this.form.controls.Code.setValue(item.Code);

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
      a.Active = true;

      this.masterService.postMasterData(3, a).subscribe(
        (res) => {
          console.log(res);
          const Idx = this.dataList.map((item) => item.Id).indexOf(res.Id);

          if (Idx == -1) {
            this.dataList.push(res);
          } else {
            this.dataList[Idx] = res;
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

  trackByFn(index, item) {
    return item.id; // unique id corresponding to the item
  }
}
