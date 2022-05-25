import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SystemfunctionService } from "src/app/core/services/systemfunction.service";
import { SystemUserFilterParams } from "src/app/pages/employee/SystemUserFilterParams";

@Component({
  selector: "app-column-selector",
  templateUrl: "./column-selector.component.html",
  styleUrls: ["./column-selector.component.scss"],
})
export class ColumnSelectorComponent implements OnInit, OnDestroy {
  @Input() employeeParams: SystemUserFilterParams;
  filterForm: FormGroup;
  columnNamesList: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private systemFunction: SystemfunctionService
  ) {
    // this.form = this.fb.group({
    //   Name: fb.control([]),
    //   CivilId: fb.control([]),
    //   FileNo: fb.control([]),
    // });
    this.filterForm = this.fb.group({
      Name: [""],
      CivilId: [""],
      FileNo: [""],
    });
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    // this.systemFunction
    //   .getColumnsList("V_PersonalDataSearch")
    //   .subscribe((x) => {
    //     Object.assign(this.columnNamesList, x);
    //   });

    this.systemFunction
      .getColumnsList("V_PersonalDataSearch")
      .pipe(takeUntil(this._unsubscribeAll))
      // .map((d) => d.cres.json())
      .subscribe((data) => {
        // Store the data
        //this.columnNamesList = data;
        console.log(this.columnNamesList);
      });
  }

  get f() {
    return this.filterForm.controls;
  }

  onSubmit() {
    // this.employeeParams.CivilId = this.filterForm.get("CivilId").value;
    // this.employeeParams.Name = this.filterForm.get("Name").value;
    // this.employeeParams.FileNo = this.filterForm.get("FileNo").value;
    // this.systemFunction.changeEmployeeFilter(this.employeeParams);
    // console.log(this.filterForm.value);
    // console.log(this.filterForm);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
