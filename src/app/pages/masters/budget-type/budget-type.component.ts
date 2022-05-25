import { Component, EventEmitter, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MastersService } from "src/app/core/services/masters.service";
import Swal from "sweetalert2";
import { MasterData } from "../MasterData";
import { MasterBudgetType } from "./MasterBudgetType";

@Component({
  selector: "app-budget-type",
  templateUrl: "./budget-type.component.html",
  styleUrls: ["./budget-type.component.scss"],
})
export class BudgetTypeComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  event: EventEmitter<any> = new EventEmitter();

  masterDataList: MasterData[] = [];
  dataList: MasterBudgetType[] = [];

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
      { label: "Budget Type", active: true },
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
    this.masterService.getMasterDataList(5, null).subscribe(
      (x) => {
        Object.assign(this.masterDataList, x);

        const newArray = this.masterDataList.map(
          ({ FkId1, FkId2, FkDesc1, FkDesc2, ...keepAttrs }) => keepAttrs
        );

        this.dataList = newArray;

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

  openEditModal(dataModal: any, item: MasterBudgetType) {
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

      this.masterService.postMasterData(5, a).subscribe(
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
