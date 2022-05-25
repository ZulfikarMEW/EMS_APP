import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CookieService } from "ngx-cookie-service";

import Swal from "sweetalert2";
import { LeaveService } from "src/app/core/services/leave.service";
import { LeaveFilterParams } from "src/app/core/models/leaveFilterParams";
import { VLeaveFilter } from "src/app/core/models/VLeaveFilter";
import { Leave } from "src/app/core/models/leave";
import { LeaveBalanceDto } from "src/app/core/models/LeaveBalanceDto";
import { SystemfunctionService } from "src/app/core/services/systemfunction.service";
import { UserProfile } from "src/app/core/models/userProfile.models";
import { VLeaveHeader } from "src/app/core/models/VLeaveHeader";
import { UserProfileService } from "src/app/core/services/user.service";
import { SystemUserFilterParams } from "../../employee/SystemUserFilterParams";
import { UpdateRequestModel } from "../UpdateRequestModel";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { RoleFunction } from "src/app/core/models/RoleFunction";

@Component({
  selector: "app-leave",
  templateUrl: "./leave.component.html",
  styleUrls: ["./leave.component.scss"],
})
export class LeaveComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  leaveData: VLeaveFilter[] = [];
  selectedLeaveData: VLeaveFilter = new VLeaveFilter();

  leaveForm: FormGroup;
  userLeaveHeader: VLeaveHeader = new VLeaveHeader();
  userLeaveBalance: LeaveBalanceDto[] = [];

  currentUser;
  statData: { icon: string; title: string; value: number }[];

  leaveParams: LeaveFilterParams = new LeaveFilterParams();
  modalTitle: string;
  editMode: boolean = false;
  employeeParams: SystemUserFilterParams = new SystemUserFilterParams();
  employeeList: UserProfile[] = [];
  selectedEmployee: UserProfile = new UserProfile();
  leaveFormSubmit: boolean;

  loading: boolean = false;
  showReport: boolean = false;

  userAccess: RoleFunction[] = [];
  hasViewAccess: boolean = false;
  hasAddAccess: boolean = false;
  hasEditAccess: boolean = false;
  hasDeleteAccess: boolean = false;
  userAccessFiltered: RoleFunction = new RoleFunction();

  // @ViewChild("modalShow") modalShow: TemplateRef<any>;
  // @ViewChild("editmodalShow") editmodalShow: TemplateRef<any>;

  // formEditData: FormGroup;
  // submitted = false;
  // category: any[];
  // newEventDate: any;
  // editEvent: any;
  // //calendarEvents: EventInput[] = [];
  // calendarDataDto: CalendarDataDto[] = [];
  // calendarData: CalendarData[] = [];
  // // event form
  // formData: FormGroup;

  // calendarOptions: CalendarOptions = {
  //   headerToolbar: {
  //     left: "dayGridMonth,dayGridWeek,dayGridDay",
  //     center: "title",
  //     right: "prevYear,prev,next,nextYear",
  //   },
  //   initialView: "dayGridMonth",
  //   themeSystem: "bootstrap",
  //   initialEvents: calendarEvents,
  //   weekends: true,
  //   editable: true,
  //   selectable: true,
  //   selectMirror: true,
  //   dayMaxEvents: true,
  //   dateClick: this.openModal.bind(this),
  //   eventClick: this.handleEventClick.bind(this),
  //   eventsSet: this.handleEvents.bind(this),
  //   eventTimeFormat: {
  //     // like '14:30:00'
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     meridiem: false,
  //     hour12: true,
  //   },
  // };
  // currentEvents: EventApi[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private leaveService: LeaveService,
    private systemFunction: SystemfunctionService,
    private userService: UserProfileService,
    public _cookiesService: CookieService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Request" },
      { label: "Leave", active: true },
    ];

    this.userService.getUserRoleFunction().subscribe((res: any) => {
      Object.assign(this.userAccess, res.RoleFunctions);

      this.userAccessFiltered = this.userAccess.find(
        (t) => t.SystemRoleFunctionId == 4
      );

      if (this.userAccessFiltered != null) {
        this.hasViewAccess = this.userAccessFiltered.AllowView;
        this.hasAddAccess = this.userAccessFiltered.AllowAdd;
        this.hasEditAccess = this.userAccessFiltered.AllowEdit;
        this.hasDeleteAccess = this.userAccessFiltered.AllowDelete;
      }
    });

    this.leaveForm = this.fb.group({
      Id: [""],
      LeaveTypeId: ["", [Validators.required]],
      LeaveStarted: ["", [Validators.required]],
      LeaveEnded: ["", [Validators.required]],
      ReturnedDate: [""],
      RequestedFor: [""],
      IsLocalVacation: false,
    });

    // this.formData = this.formBuilder.group({
    //   title: ["", [Validators.required]],
    //   category: ["", [Validators.required]],
    // });

    // this.formEditData = this.formBuilder.group({
    //   editTitle: ["", [Validators.required]],
    //   editCategory: [],
    // });

    // this.systemFunction.currentUser.subscribe((uid) => {
    //   this.currentUser = uid;
    //
    // });

    this.currentUser = JSON.parse(this._cookiesService.get("user"));

    this.fetchData();

    // //console.log(calendarEvents);

    // this.leaveService.postLeaveCalendarData(this.leaveParams).subscribe((x) => {
    //   Object.assign(this.calendarDataDto, x);

    //   //calendarEvents.length = 0;

    //   this.calendarDataDto.forEach((c) => {
    //     if (c.status == "Pending") {
    //       c.className = "bg-warning text-white";
    //     } else if (c.status == "Approved") {
    //       c.className = "bg-success text-white";
    //     } else if (c.status == "Rejected") {
    //       c.className = "bg-danger text-white";
    //     } else if (c.status == "Canceled") {
    //       c.className = "bg-dark text-white";
    //     }

    // const calendarApi = this.newEventDate.view.calendar;

    // let title = c.title;
    // let start = c.start;
    // let end = c.end;
    // let cName = c.className;
    // calendarApi.addEvent({
    //   id: createEventId(),
    //   title,
    //   start: new Date(start), //this.newEventDate.date,
    //   end: new Date(end), //this.newEventDate.date,
    //   className: cName, //className + " " + "text-white",
    // });
    // this.position();
    // this.formData = this.formBuilder.group({
    //   title: "",
    //   category: "",
    // });
    // this.modalService.dismissAll();

    // let a = new CalendarData();

    // a.className = c.className;
    // a.end = c.end;
    // a.id = c.id;
    // a.start = c.start;
    // a.title = c.title;

    // this.calendarEvents.push(a);
    // });

    // calendarEvents.push(
    //   this.calendarDataDto.map(({ status, ...keepAttrs }) => keepAttrs)
    // );

    // this.calendarData = this.calendarDataDto.map(
    //   ({ status, ...keepAttrs }) => keepAttrs
    // );

    // delete this.calendarDataDto["status"];

    // this.calendarEvents = this.calendarDataDto;

    // //console.log(this.calendarData);

    // //console.log(calendarEvents);

    //this.calendarOptions.initialEvents = calendarEvents;
    // });

    //this._fetchData();
  }

  fetchData() {
    this.statData = [];

    this.leaveParams.UserId = this.currentUser.Id;
    this.leaveParams.Year = new Date().getFullYear();
    // this.employeeParams.CivilId == this.currentUser.CivilId;

    ////console.log(this.currentUser);

    ////console.log(this.employeeParams);
    this.selectedEmployee = this.currentUser;
    // this.userService.getUsersList(this.employeeParams).subscribe((x) => {
    //   Object.assign(this.employeeList, x);
    //   this.selectedEmployee = this.employeeList[0];
    // });

    this.leaveService.postLeaveFilter(this.leaveParams).subscribe((x) => {
      Object.assign(this.leaveData, x);
    });

    this.leaveService.postLeaveBalance(this.leaveParams).subscribe((x) => {
      Object.assign(this.userLeaveBalance, x);
      //console.log(this.userLeaveBalance);
    });

    this.leaveService.postLeaveHeader(this.leaveParams).subscribe((x) => {
      Object.assign(this.userLeaveHeader, x);
      //console.log(this.userLeaveHeader);

      this.statData = [
        {
          icon: "bx bx-check-circle",
          title: "Leave Taken",
          value: this.userLeaveHeader.TakenLeaves,
        },
        {
          icon: "bx bx-hourglass",
          title: "Pending Request",
          value: this.userLeaveHeader.PendingRequests,
        },
        {
          icon: "bx bx-add-to-queue",
          title: "Extra Taken Leaves",
          value: this.userLeaveHeader.DelayedDays,
        },
      ];
    });
  }

  get f() {
    return this.leaveForm.controls;
  }

  onSubmit() {
    if (this.hasEditAccess && this.hasAddAccess) {
      //console.log(this.leaveForm);

      if (
        this.leaveForm.get("LeaveTypeId").value == 3 &&
        this.currentUser.SystemGenderId == 1
      ) {
        Swal.fire(
          "Warning!",
          "Selected gender is mismatching with selected leave type.",
          "warning"
        );
        return;
      }

      this.leaveFormSubmit = true;

      if (this.leaveForm.valid) {
        Swal.fire({
          title: "Are you sure?",
          text: "You want to save this request?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Yes, save it!",
        }).then((result) => {
          if (result.value) {
            let u = new Leave();

            u.Id = this.leaveForm.get("Id").value;
            u.LeaveTypeId = this.leaveForm.get("LeaveTypeId").value;
            u.LeaveStarted = this.leaveForm.get("LeaveStarted").value;
            u.LeaveEnded = this.leaveForm.get("LeaveEnded").value;
            u.ReturnedDate = null; //this.leaveForm.get("ReturnedDate").value;
            if (this.leaveForm.get("IsLocalVacation").value != null) {
              u.IsLocalVacation = this.leaveForm.get("IsLocalVacation").value;
            } else {
              u.IsLocalVacation = false;
            }
            u.RequestedFor = this.leaveParams.UserId;

            this.leaveService.postLeave(u).subscribe(
              (res) => {
                Swal.fire("Saved!", "Request has been saved.", "success");

                //console.log(res);

                if (!this.editMode) {
                  this.leaveData.push(res);
                } else {
                  const Idx = this.leaveData
                    .map((item) => item.Id)
                    .indexOf(res.Id);
                  this.leaveData[Idx] = res;
                }

                // this.leaveData.sort((val1, val2) => {
                //   return (
                //     new Date(val2.LeaveStarted) - new Date(val1.LeaveStarted)
                //   );
                // });

                this.leaveData.sort((a, b) => {
                  return (
                    <any>new Date(b.RequestTime) - <any>new Date(a.RequestTime)
                  );
                });

                this.modalService.dismissAll();
                this.leaveFormSubmit = false;
                this.editMode = false;
              },
              (err) => {
                Swal.fire(
                  "Failed!",
                  "Something went wrong. Please check your data",
                  "error"
                );
                //console.log(err);
              }
            );
          }
        });
      } else {
        Swal.fire(
          "Failed!",
          "Something went wrong. Please check your data",
          "error"
        );
      }
    } else {
      Swal.fire(
        "Access Denied!",
        "You do not have access to perform this action",
        "error"
      );
    }
  }

  empFormSubmit() {}

  editBalanceValue: boolean = false;

  editBalance(): boolean {
    this.editBalanceValue = !this.editBalanceValue;
    // //console.log(this.editBalanceValue[i]);
    ////console.log(data);
    return this.editBalanceValue;
  }

  updateBalance(): boolean {
    if (this.hasEditAccess) {
      this.editBalanceValue = !this.editBalanceValue;
      // //console.log(this.editBalanceValue[i]);
      ////console.log(data);
    } else {
      Swal.fire(
        "Access Denied!",
        "You do not have access to perform this action",
        "error"
      );
    }
    return this.editBalanceValue;
  }

  statusClass(str): string {
    if (str == "Approved") {
      return "badge rounded-pill bg-success ms-1";
    }
    if (str == "Canceled") {
      return "badge rounded-pill bg-dark ms-1";
    }
    if (str == "Pending") {
      return "badge rounded-pill bg-warning ms-1";
    }
    if (str == "Rejected") {
      return "badge rounded-pill bg-danger ms-1";
    }
  }

  cancelRequest(req: VLeaveFilter) {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel this request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.value) {
        let s = new UpdateRequestModel();

        s.Id = req.Id;
        s.Status = "C";

        this.leaveService.postChangeRequestStatus(s).subscribe(
          (x) => {
            const Idx = this.leaveData.map((item) => item.Id).indexOf(x.Id);
            this.leaveData[Idx] = x;
            Swal.fire(
              "Canceled!",
              "This request has been canceled.",
              "success"
            );
          },
          (err) => {
            Swal.fire(
              "Failed!",
              "Server returned with message " + err,
              "error"
            );
          }
        );
      }
    });
  }

  openModal(newDataModal: any) {
    this.leaveForm.reset();

    this.leaveService.postLeaveBalance(this.leaveParams).subscribe(
      (x) => {
        Object.assign(this.userLeaveBalance, x);
      },
      (err) => {
        Swal.fire("Failed!", "Server returned with message " + err, "error");
      }
    );

    // this.formData().clear();
    // this.systemRoleFunction.sort((a, b) => a.Name.localeCompare(b.Name));
    // this.systemRoleFunction.forEach((o) => {
    //   let r = this.fb.group({
    //     Id: o.Id,
    //     Name: o.Name,
    //     AllowView: false,
    //     AllowAdd: false,
    //     AllowEdit: false,
    //     AllowDelete: false,
    //   });
    //   this.formData().push(r);
    // });
    // this.editMode = false;
    // this.roleForm.reset();
    this.modalTitle = "New Request";
    this.modalService.open(newDataModal, { size: "xl", centered: false });
  }

  openLeaveFormModal(emergencyLeaveFormModal, item) {
    this.selectedLeaveData = item;

    if (item.LeaveType == "Emergency Leave") {
      this.modalService.open(emergencyLeaveFormModal, {
        size: "xl",
        centered: false,
      });
    } else {
      this.showReport = true;
      setTimeout(() => {
        this.createPDF();
        this.showReport = false;
      }, 100);
      // this.modalService.open(leaveFormModal, { size: "xl", centered: false });
    }
  }

  openEditModal(editDataModal: any, emp: Leave) {
    this.modalTitle = "Edit";

    this.leaveForm.controls.Id.setValue(emp.Id);
    this.leaveForm.controls.LeaveTypeId.setValue(emp.LeaveTypeId);
    this.leaveForm.controls.LeaveStarted.setValue(emp.LeaveStarted);
    this.leaveForm.controls.LeaveEnded.setValue(emp.LeaveEnded);
    this.leaveForm.controls.IsLocalVacation.setValue(emp.IsLocalVacation);

    this.editMode = true;

    this.modalService.open(editDataModal, { size: "lg", centered: false });
    // this.modalService.open(newDataModal);
  }

  createPDF() {
    let DATA = document.getElementById("reportData");

    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;

      const FILEURI = canvas.toDataURL("image/png");
      let PDF = new jsPDF("p", "mm", "a4");
      let position = 0;
      PDF.addImage(FILEURI, "PNG", 0, position, fileWidth, fileHeight);

      PDF.save("LeaveReport.pdf");
      this.showReport = false;
    });
  }
}

/**
 * Event click modal show
 */
// handleEventClick(clickInfo: EventClickArg) {
//   this.editEvent = clickInfo.event;
//   this.formEditData = this.formBuilder.group({
//     editTitle: clickInfo.event.title,
//     editCategory: clickInfo.event.classNames[0],
//   });
//   this.modalService.open(this.editmodalShow);
// }

// /**
//  * Events bind in calander
//  * @param events events
//  */
// handleEvents(events: EventApi[]) {
//   this.currentEvents = events;
// }

// get form() {
//   return this.formData.controls;
// }

/**
 * Delete-confirm
 */
// confirm() {
//   Swal.fire({
//     title: "Are you sure?",
//     text: "You won't be able to revert this!",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonColor: "#34c38f",
//     cancelButtonColor: "#f46a6a",
//     confirmButtonText: "Yes, delete it!",
//   }).then((result) => {
//     if (result.value) {
//       this.deleteEventData();
//       Swal.fire("Deleted!", "Event has been deleted.", "success");
//     }
//   });
// }

// position() {
//   Swal.fire({
//     position: "center",
//     icon: "success",
//     title: "Event has been saved",
//     showConfirmButton: false,
//     timer: 1000,
//   });
// }

/**
 * Event add modal
 */
// openModal(event?: any) {
//   this.newEventDate = event;
//   this.modalService.open(this.modalShow);
// }

/**
 * save edit event data
 */
// editEventSave() {
//   const editTitle = this.formEditData.get("editTitle").value;
//   const editCategory = this.formEditData.get("editCategory").value;

//   const editId = calendarEvents.findIndex(
//     (x) => x.id + "" === this.editEvent.id + ""
//   );

//   this.editEvent.setProp("title", editTitle);
//   this.editEvent.setProp("classNames", editCategory);

//   calendarEvents[editId] = {
//     ...this.editEvent,
//     title: editTitle,
//     id: this.editEvent.id,
//     classNames: editCategory + " " + "text-white",
//   };

//   this.position();
//   this.formEditData = this.formBuilder.group({
//     editTitle: "",
//     editCategory: "",
//   });
//   this.modalService.dismissAll();
// }

/**
 * Delete event
 */
// deleteEventData() {
//   this.editEvent.remove();
//   this.modalService.dismissAll();
// }

/**
 * Close event modal
 */
// closeEventModal() {
//   this.formData = this.formBuilder.group({
//     title: "",
//     category: "",
//   });
//   this.modalService.dismissAll();
// }

/**
 * Save the event
 */
// saveEvent() {
//   if (this.formData.valid) {
//     const title = this.formData.get("title").value;
//     const className = this.formData.get("category").value;
//     const calendarApi = this.newEventDate.view.calendar;
//     calendarApi.addEvent({
//       id: createEventId(),
//       title,
//       start: this.newEventDate.date,
//       end: this.newEventDate.date,
//       className: className + " " + "text-white",
//     });
//     this.position();
//     this.formData = this.formBuilder.group({
//       title: "",
//       category: "",
//     });
//     this.modalService.dismissAll();
//   }
//   this.submitted = true;
// }

/**
 * Fetches the data
 */
// private _fetchData() {
//   // Event category
//   this.category = category;
//   // Calender Event Data

//   // this.leaveService.postLeaveCalendarData(this.leaveParams).subscribe((x) => {
//   //   Object.assign(this.calendarDataDto, x);

//   //   this.calendarEvents = [];

//   //   this.calendarDataDto.forEach((c) => {
//   //     if (c.status == "Pending") {
//   //       c.className = "bg-warning text-white";
//   //     } else if (c.status == "Approved") {
//   //       c.className = "bg-success text-white";
//   //     } else if (c.status == "Rejected") {
//   //       c.className = "bg-danger text-white";
//   //     } else if (c.status == "Canceled") {
//   //       c.className = "bg-dark text-white";
//   //     }

//   //     let a = new CalendarData();

//   //     a.className = c.className;
//   //     a.end = c.end;
//   //     a.id = c.id;
//   //     a.start = c.start;
//   //     a.title = c.title;

//   //     this.calendarEvents.push(a);
//   //   });

//   //   //this.calendarEvents = this.calendarDataDto;

//   //   //console.log(this.calendarEvents);
//   // });

//   //this.calendarEvents = this.calendarEvents;
//   // form submit
//   this.submitted = false;
// }
// }
