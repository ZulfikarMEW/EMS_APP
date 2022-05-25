import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
} from "@angular/core";
import { BonusService } from "src/app/core/services/bonus.service";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { BonusValidationErrors } from "./BonusValidationErrors";

interface DATA {
  CivilId: Number;
  FileNo: Number;
  Percentage: Number;
  Grade: String;
  GradeType: String;
}

@Component({
  selector: "app-upload",
  templateUrl: "./upload.component.html",
  styleUrls: ["./upload.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  radialoptions;
  shortLink: any;
  validationErrorList: BonusValidationErrors[] = [];
  constructor(
    private bonusService: BonusService,
    private cdr: ChangeDetectorRef
  ) {}
  public isCollapsed = false;

  title = "dropzone";

  files: File[] = [];

  data;

  processMessage: string = "";
  isStartedProcess: boolean = false;

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Bonus" },
      { label: "File Upload", active: true },
    ];

    this.radialoptions = {
      series: [76],
      chart: {
        height: 150,
        type: "radialBar",
        sparkline: {
          enabled: true,
        },
      },
      colors: ["#556ee6"],
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#e7e7e7",
            strokeWidth: "97%",
            margin: 5, // margin is in pixels
          },
          hollow: {
            size: "60%",
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              offsetY: -2,
              fontSize: "16px",
            },
          },
        },
      },
      grid: {
        padding: {
          top: -10,
        },
      },
      stroke: {
        dashArray: 3,
      },
      labels: ["Storage"],
    };
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
  // onSelect(event) {
  //   console.log(event);
  //   this.files.push(...event.addedFiles);

  //   const formData = new FormData();

  //   for (var i = 0; i < this.files.length; i++) {
  //     formData.append("file[]", this.files[i]);
  //   }

  //   // this.http
  //   //   .post("http://localhost:8001/upload.php", formData)
  //   //   .subscribe((res) => {
  //   //     console.log(res);
  //   //     alert("Uploaded Successfully.");
  //   //   });
  // }

  // onRemove(event) {
  //   console.log(event);
  //   this.files.splice(this.files.indexOf(event), 1);
  // }

  onSelect(event) {
    //console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  async uploadToServer() {
    this.bonusService.upload(this.files[0]).subscribe((x: any) => {
      //if (typeof x === "object") {
      console.log(x);
      this.processMessage = "Uploaded";

      setTimeout(() => {
        this.isStartedProcess = true;
        this.processMessage = "Converting...";
      }, 1000);

      setTimeout(() => {
        this.convertExcelToJson();
      }, 2000);
      //}
    });
  }

  startProcess() {
    if (this.files[0] == null) {
      Swal.fire("Error!", "Please select the file first.", "warning");
      return;
    }

    this.isStartedProcess = true;
    this.processMessage = "Uploading...";

    setTimeout(() => {
      this.uploadToServer();
    }, 2000);
  }

  async convertExcelToJson() {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = this.files[0]; //ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: "binary" });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      const dataString = JSON.stringify(jsonData);
      // document.getElementById("output").innerHTML = dataString
      //   .slice(0, 300)
      //   .concat("...");
      // this.setDownload(dataString);

      //console.log(dataString);

      //Object.assign(data, dataString);
      this.data = JSON.parse(dataString).Sheet1;
      console.log(this.data);
      this.processMessage = this.data.length + " rows converted";

      setTimeout(() => {
        this.processMessage = "Data validation initiated...";
      }, 1000);

      setTimeout(() => {
        this.insertToDatabase();
      }, 2000);
    };
    reader.readAsBinaryString(file);
  }

  async insertToDatabase() {
    this.bonusService.postInsertData(this.data).subscribe(
      (x) => {
        this.processMessage = "Inserted";
        // this.isStartedProcess = false;
        console.log(x);
        setTimeout(() => {
          this.processMessage = "Getting Validation Errors";
          this.bonusService.getvadidationErrors().subscribe((x) => {
            Object.assign(this.validationErrorList, x);

            setTimeout(() => {}, 1000);

            this.cdr.detectChanges();

            this.processMessage = "Generating Error List";

            if (this.validationErrorList.length > 0) {
              this.isStartedProcess = false;
              Swal.fire(
                "Information",
                this.validationErrorList.length + " error(s) found",
                "info"
              );
            } else {
              setTimeout(() => {
                this.processMessage =
                  "No errors found. Starting to upload annual evaluation data for the current year...";
              }, 1000);

              setTimeout(() => {
                this.isStartedProcess = true;
                this.processMessage = "Updating Annual Evaluation Data";
                this.updateAnnualEvaluationData();
              }, 2000);
            }
          });
        }, 2000);
      },
      (err) => {
        this.isStartedProcess = false;
        Swal.fire("Failed", "Failed to import. Invalid Data found", "error");
      }
    );
  }

  async updateAnnualEvaluationData() {
    this.bonusService.getUpdateAnnualEvaluationData().subscribe(
      (x) => {
        this.processMessage = "Updated";
        this.isStartedProcess = false;
        Swal.fire("Success", "Annual evaluation data imported", "error");
      },
      (res) => {
        this.processMessage = "Failed to Update";
        this.isStartedProcess = false;
        Swal.fire("Failed", "Failed to update annual evaluation data", "error");
      }
    );
  }

  trackByFn(index, item) {
    return item.id; // unique id corresponding to the item
  }
}
