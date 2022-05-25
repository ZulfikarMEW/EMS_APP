import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { LeaveReportData } from "src/app/core/models/LeaveReportData";
import { LeaveService } from "src/app/core/services/leave.service";
import { LeaveLeaveTypeDto } from "./LeaveLeaveTypeDto";
import { VLeaveReport } from "./VLeaveReport";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { TranslateService } from "@ngx-translate/core";
import { RoleFunction } from "src/app/core/models/RoleFunction";
import { UserProfileService } from "src/app/core/services/user.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-leavereport",
  templateUrl: "./leavereport.component.html",
  styleUrls: ["./leavereport.component.scss"],
})
export class LeavereportComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  filterForm: FormGroup;
  leaveReport: VLeaveReport[] = [];
  leaveReportResult: any[] = [];
  leaveParams: LeaveReportData = new LeaveReportData();
  // employeeList: LeaveEmployeeDto[] = [];
  leaveTypeList: LeaveLeaveTypeDto[] = [];
  statusList: { Id: string; Name: string }[] = [];
  showReport: boolean = false;

  @ViewChild("reportContent") reportContent: ElementRef;
  loading: boolean = false;

  userAccess: RoleFunction[] = [];
  hasViewAccess: boolean = false;
  hasAddAccess: boolean = false;
  hasEditAccess: boolean = false;
  hasDeleteAccess: boolean = false;
  userAccessFiltered: RoleFunction = new RoleFunction();

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    public translate: TranslateService,
    private userService: UserProfileService
  ) {
    this.filterForm = this.fb.group({
      Name: [],
      CivilId: [],
      FileNo: [],
      Delayed: [false],
      Returned: [false],
      NotReturned: [false],
      LeaveFrom: [""],
      LeaveTo: [""],
      LeaveTypeId: [""],
      Status: [""],
    });
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Approval" },
      { label: "Report", active: true },
    ];

    this.userService.getUserRoleFunction().subscribe((res: any) => {
      Object.assign(this.userAccess, res.RoleFunctions);

      this.userAccessFiltered = this.userAccess.find(
        (t) => t.SystemRoleFunctionId == 7
      );

      if (this.userAccessFiltered != null) {
        this.hasViewAccess = this.userAccessFiltered.AllowView;
        this.hasAddAccess = this.userAccessFiltered.AllowAdd;
        this.hasEditAccess = this.userAccessFiltered.AllowEdit;
        this.hasDeleteAccess = this.userAccessFiltered.AllowDelete;
      }
    });

    // if (this._cookiesService.get("lang") == "en") {
    //   this.statusList = [
    //     { Id: "P", Name: "Pending" },
    //     { Id: "A", Name: "Approved" },
    //     { Id: "C", Name: "Canceled" },
    //     { Id: "R", Name: "Rejected" },
    //     { Id: "D", Name: "Delayed" },
    //     { Id: "N", Name: "Not Returned" },
    //     { Id: "J", Name: "Rejected" },
    //   ];
    // }
    // this.leaveService.getEmployeeList().subscribe((x) => {
    //   Object.assign(this.employeeList, x);
    // });

    this.leaveService.getLeaveTypeList().subscribe((x) => {
      Object.assign(this.leaveTypeList, x);
    });

    // var str = new Date().toString();
    //str.replace(/[^a-zA-Z ]/g, "");
  }

  get f() {
    return this.filterForm.controls;
  }

  createPDF() {
    // const doc = new jsPDF();
    // doc.text("Hello world!", 10, 10);
    // doc.save("a4.pdf");

    let DATA = document.getElementById("reportData");

    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;

      const FILEURI = canvas.toDataURL("image/png");
      let PDF = new jsPDF("p", "mm", "a4");
      let position = 0;
      PDF.addImage(FILEURI, "PNG", 0, position, fileWidth, fileHeight);

      PDF.save("LeaveReport.pdf");
    });
  }

  // downloadPdf() {
  //   const doc = new jsPDF();
  //   const specialElementHandlers = {
  //     "#editor": function (element, renderer) {
  //       return true;
  //     },
  //   };

  //   const content = this.reportContent.nativeElement;

  //   doc.fromHTML(content.innerHTML, 15, 15, {
  //     width: 190,
  //     elementHandlers: specialElementHandlers,
  //   });

  //   doc.save("LeaveReport" + ".pdf");
  // }

  // public convetToPDF() {
  //       var data = document.getElementById('contentToConvert');
  //       html2canvas(data).then(canvas => {
  //           // Few necessary setting options
  //           var imgWidth = 208;
  //           var pageHeight = 295;
  //           var imgHeight = canvas.height * imgWidth / canvas.width;
  //           var heightLeft = imgHeight;
  //           const contentDataURL = canvas.toDataURL('image/png')
  //           let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
  //           var position = 0;
  //           pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
  //           pdf.save('new-file.pdf'); // Generated PDF
  //       });
  //   }

  onSubmit() {
    if (this.hasAddAccess) {
      this.loading = true;
      switch (this.filterForm.get("Status").value) {
        case "N": {
          this.leaveParams.Status = "N";
          this.leaveParams.Delayed = false;
          this.leaveParams.NotReturned = false;
          this.leaveParams.Returned = false;
          break;
        }
        case "A": {
          this.leaveParams.Status = "A";
          this.leaveParams.Delayed = false;
          this.leaveParams.NotReturned = false;
          this.leaveParams.Returned = false;
          break;
        }
        case "C": {
          this.leaveParams.Status = "C";
          this.leaveParams.Delayed = false;
          this.leaveParams.NotReturned = false;
          this.leaveParams.Returned = false;
          break;
        }
        case "R": {
          this.leaveParams.Status = "R";
          this.leaveParams.Delayed = false;
          this.leaveParams.NotReturned = false;
          this.leaveParams.Returned = false;
          break;
        }
        case "D": {
          this.leaveParams.Status = null;
          this.leaveParams.Delayed = true;
          this.leaveParams.NotReturned = false;
          this.leaveParams.Returned = false;
          break;
        }
        case "O": {
          this.leaveParams.Status = null;
          this.leaveParams.Delayed = false;
          this.leaveParams.NotReturned = true;
          this.leaveParams.Returned = false;
          break;
        }
        case "T": {
          this.leaveParams.Status = null;
          this.leaveParams.Delayed = false;
          this.leaveParams.NotReturned = false;
          this.leaveParams.Returned = true;
          break;
        }
        default: {
          this.leaveParams.Status = null;
          this.leaveParams.Delayed = false;
          this.leaveParams.NotReturned = false;
          this.leaveParams.Returned = false;
          break;
        }
      }

      this.leaveParams.LeaveFrom = this.filterForm.get("LeaveFrom").value;
      this.leaveParams.LeaveTo = this.filterForm.get("LeaveTo").value;

      this.leaveParams.LeaveTypeId = this.filterForm.get("LeaveTypeId").value;
      this.leaveParams.CivilId = this.filterForm.get("CivilId").value;
      this.leaveParams.Name = this.filterForm.get("Name").value;
      this.leaveParams.FileNo = this.filterForm.get("FileNo").value;

      this.leaveReport = [];

      this.leaveService.postLeaveReport(this.leaveParams).subscribe((x) => {
        Object.assign(this.leaveReport, x);

        // this.leaveReport = this.leaveReport.sort((a, b) =>
        //   a.RequestedFor > b.RequestedFor ? 1 : -1
        // );

        var groups = new Set(this.leaveReport.map((item) => item.RequestedFor));
        this.leaveReportResult = [];
        groups.forEach((g) =>
          this.leaveReportResult.push({
            name: g,
            fNo: this.leaveReport.filter((i) => i.RequestedFor === g)[0].FileNo,
            cId: this.leaveReport.filter((i) => i.RequestedFor === g)[0]
              .CivilId,
            mobile: this.leaveReport.filter((i) => i.RequestedFor === g)[0]
              .Mobile,
            oNo: this.leaveReport.filter((i) => i.RequestedFor === g)[0]
              .OfficePhone,
            hNo: this.leaveReport.filter((i) => i.RequestedFor === g)[0]
              .HomePhone,
            values: this.leaveReport.filter((i) => i.RequestedFor === g),
          })
        );

        this.showReport = true;
        //console.log(this.leaveReport);

        this.loading = false;
      });

      // this.leaveParams.Delayed = this.filterForm.get("Delayed").value;
      // this.leaveParams.LeaveFrom = this.filterForm.get("LeaveFrom").value;
      // this.leaveParams.LeaveTo = this.filterForm.get("LeaveTo").value;
      // this.leaveParams.LeaveTypeId = this.filterForm.get("LeaveTypeId").value;
      // this.leaveParams.Status = this.filterForm.get("Status").value;
      // this.leaveParams.UserId = this.filterForm.get("UserId").value;
      // this.leaveParams.Returned = this.filterForm.get("Returned").value;
      // this.leaveParams.NotReturned = this.filterForm.get("NotReturned").value;
      // this.leaveService.postLeaveReport(this.leaveParams).subscribe((x) => {
      //       Object.assign(this.LeaveReport, x);
      //     });
    } else {
      Swal.fire(
        "Access Denied!",
        "You do not have access to perform this action",
        "error"
      );
    }
  }

  clearParams() {
    this.filterForm.reset();
  }
}
