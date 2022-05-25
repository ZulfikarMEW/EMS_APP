import { Component, EventEmitter, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MastersService } from "src/app/core/services/masters.service";
import Swal from "sweetalert2";
import { MasterData } from "../MasterData";
import { MasterAnnualEvaluation } from "./MasterAnnualEvaluation";

@Component({
  selector: "app-annual-evaluation",
  templateUrl: "./annual-evaluation.component.html",
  styleUrls: ["./annual-evaluation.component.scss"],
})
export class AnnualEvaluationComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  event: EventEmitter<any> = new EventEmitter();

  masterDataList: MasterData[] = [];
  // masterSubDataList: MasterData[] = [];
  // masterSubDataList2: MasterData[] = [];
  dataList: MasterAnnualEvaluation[] = [];

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
      { label: "Annual Evaluation", active: true },
    ];

    this.form = this.fb.group({
      Id: [""],
      Code: ["", [Validators.required]],
      Description: ["", [Validators.required]],
      StartValue: ["", [Validators.required]],
      EndValue: ["", [Validators.required]],
    });

    this.fetchData();
  }

  get f() {
    return this.form.controls;
  }

  fetchData() {
    this.isLoading = true;
    this.masterService.getMasterDataList(13, null).subscribe(
      (x) => {
        Object.assign(this.masterDataList, x);

        this.dataList = [];

        this.masterDataList.forEach((x) => {
          let a = new MasterAnnualEvaluation();

          a.Active = x.Active;
          a.Code = x.Code;
          a.Description = x.Description;
          a.Id = x.Id;
          a.StartValue = x.FkId1;
          a.EndValue = x.FkId2;

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
  }

  openEditModal(dataModal: any, item: MasterAnnualEvaluation) {
    this.form.reset();

    this.form.controls.Id.setValue(item.Id);
    this.form.controls.Description.setValue(item.Description);
    this.form.controls.Code.setValue(item.Code);
    this.form.controls.StartValue.setValue(item.StartValue);
    this.form.controls.EndValue.setValue(item.EndValue);

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
      a.FkId1 = this.form.value.StartValue;
      a.FkId2 = this.form.value.EndValue;
      a.Active = true;

      this.masterService.postMasterData(13, a).subscribe(
        (res) => {
          console.log(res);
          const Idx = this.dataList.map((item) => item.Id).indexOf(res.Id);

          let a = new MasterAnnualEvaluation();

          a.Active = res.Active;
          a.Code = res.Code;
          a.Description = res.Description;
          a.Id = res.Id;
          a.StartValue = res.FkId1;
          a.EndValue = res.FkId2;

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
