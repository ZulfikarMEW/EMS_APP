import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import {
  CalendarOptions,
  EventClickArg,
  EventApi,
  EventInput,
} from "@fullcalendar/angular";

import Swal from "sweetalert2";
import { LeaveService } from "src/app/core/services/leave.service";
import { VLeaveFilter } from "src/app/core/models/VLeaveFilter";
import { CalendarFilter } from "src/app/core/models/CalendarFilter";

@Component({
  selector: "app-leave-calendar",
  templateUrl: "./leave-calendar.component.html",
  styleUrls: ["./leave-calendar.component.scss"],
})
export class LeaveCalendarComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  @ViewChild("modalShow") modalShow: TemplateRef<any>;
  @ViewChild("editmodalShow") editmodalShow: TemplateRef<any>;

  formEditData: FormGroup;
  submitted = false;
  category: any[];
  newEventDate: any;
  editEvent: any;
  calendarEvents: EventInput[] = []; //any[];
  // event form
  formData: FormGroup;

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: "dayGridMonth,dayGridWeek,dayGridDay",
      center: "title",
      right: "prevYear,prev,next,nextYear",
    },
    initialView: "dayGridMonth",
    themeSystem: "bootstrap",
    events: this.calendarEvents,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    dateClick: this.openModal.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventTimeFormat: {
      // like '14:30:00'
      hour: "2-digit",
      minute: "2-digit",
      meridiem: false,
      hour12: true,
    },
  };
  currentEvents: EventApi[] = [];
  leaveChartData: VLeaveFilter[] = [];

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "LMS" },
      { label: "Calendar", active: true },
    ];

    this.formData = this.formBuilder.group({
      title: ["", [Validators.required]],
      category: ["", [Validators.required]],
    });

    this.formEditData = this.formBuilder.group({
      editTitle: ["", [Validators.required]],
      editCategory: [],
    });
    this._fetchData();
  }

  /**
   * Event click modal show
   */
  handleEventClick(clickInfo: EventClickArg) {
    this.editEvent = clickInfo.event;
    this.formEditData = this.formBuilder.group({
      editTitle: clickInfo.event.title,
      editCategory: clickInfo.event.classNames[0],
    });
    this.modalService.open(this.editmodalShow);
  }

  /**
   * Events bind in calander
   * @param events events
   */
  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private leaveService: LeaveService
  ) {}

  get form() {
    return this.formData.controls;
  }

  /**
   * Delete-confirm
   */
  confirm() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this.deleteEventData();
        Swal.fire("Deleted!", "Event has been deleted.", "success");
      }
    });
  }

  position() {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Event has been saved",
      showConfirmButton: false,
      timer: 1000,
    });
  }

  /**
   * Event add modal
   */
  openModal(event?: any) {
    this.newEventDate = event;
    this.modalService.open(this.modalShow);
  }

  /**
   * save edit event data
   */
  editEventSave() {
    const editTitle = this.formEditData.get("editTitle").value;
    const editCategory = this.formEditData.get("editCategory").value;

    const editId = this.calendarEvents.findIndex(
      (x) => x.id + "" === this.editEvent.id + ""
    );

    this.editEvent.setProp("title", editTitle);
    this.editEvent.setProp("classNames", editCategory);

    this.calendarEvents[editId] = {
      ...this.editEvent,
      title: editTitle,
      id: this.editEvent.id,
      classNames: editCategory + " " + "text-white",
    };

    this.position();
    this.formEditData = this.formBuilder.group({
      editTitle: "",
      editCategory: "",
    });
    this.modalService.dismissAll();
  }

  /**
   * Delete event
   */
  deleteEventData() {
    this.editEvent.remove();
    this.modalService.dismissAll();
  }

  /**
   * Close event modal
   */
  closeEventModal() {
    this.formData = this.formBuilder.group({
      title: "",
      category: "",
    });
    this.modalService.dismissAll();
  }

  /**
   * Save the event
   */
  saveEvent() {
    if (this.formData.valid) {
      const title = this.formData.get("title").value;
      const className = this.formData.get("category").value;
      const calendarApi = this.newEventDate.view.calendar;
      calendarApi.addEvent({
        id: null, //createEventId(),
        title,
        start: this.newEventDate.date,
        end: this.newEventDate.date,
        className: className + " " + "text-white",
      });
      this.position();
      this.formData = this.formBuilder.group({
        title: "",
        category: "",
      });
      this.modalService.dismissAll();
    }
    this.submitted = true;
  }

  /**
   * Fetches the data
   */
  a: CalendarFilter = new CalendarFilter();

  private _fetchData() {
    // Event category

    this.a.UserId = null;
    this.a.Year = 2022;
    this.a.LeaveTypeId = null;
    this.a.Status = null;

    this.leaveService.postLeaveFilter(this.a).subscribe((x) => {
      Object.assign(this.leaveChartData, x);

      this.category = [
        {
          name: "Danger",
          value: "bg-danger",
        },
        {
          name: "Success",
          value: "bg-success",
        },
        {
          name: "Primary",
          value: "bg-primary",
        },
        {
          name: "Info",
          value: "bg-info",
        },
        {
          name: "Dark",
          value: "bg-dark",
        },
        {
          name: "Warning",
          value: "bg-warning",
        },
      ];
      // Calender Event Data
      this.leaveChartData.forEach((x) => {
        // let b: {
        //   id: string;
        //   title: string;
        //   start: Date;
        //   end: Date;
        //   className: "bg-warning text-white";
        // };

        // b.id = x.Id;
        // b.start = x.LeaveStarted;
        // b.end = x.LeaveEnded;
        // b.title = x.LeaveType;

        this.calendarEvents.push({
          id: x.Id,
          title: x.LeaveType,
          start: x.LeaveStarted,
          end: x.LeaveEnded,
          className: "bg-warning text-white",
        });

        console.log(this.calendarEvents);
      });

      // this.calendarOptions.initialEvents = this.calendarEvents;

      this.calendarOptions = {
        headerToolbar: {
          left: "dayGridMonth,dayGridWeek,dayGridDay",
          center: "title",
          right: "prevYear,prev,next,nextYear",
        },
        initialView: "dayGridMonth",
        themeSystem: "bootstrap",
        events: this.calendarEvents,
        weekends: true,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        dateClick: this.openModal.bind(this),
        eventClick: this.handleEventClick.bind(this),
        eventsSet: this.handleEvents.bind(this),
        eventTimeFormat: {
          // like '14:30:00'
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
          hour12: true,
        },
      };

      //   this.calendarEvents = [
      //     {
      //       id: createEventId(),
      //       title: "Meeting",
      //       start: new Date().setDate(new Date().getDate() + 1),
      //       end: new Date().setDate(new Date().getDate() + 2),
      //       className: "bg-warning text-white",
      //     },
      //     {
      //       id: createEventId(),
      //       title: "Lunch",
      //       start: new Date(),
      //       end: new Date(),
      //       className: "bg-success text-white",
      //     },
      //     {
      //       id: createEventId(),
      //       title: "Birthday - party",
      //       start: new Date().setDate(new Date().getDate() + 8),
      //       className: "bg-info text-white",
      //     },
      //     {
      //       id: createEventId(),
      //       title: "Long Event",
      //       start: new Date().setDate(new Date().getDate() + 7),
      //       end: new Date().setDate(new Date().getDate() + 8),
      //       className: "bg-primary text-white",
      //     },
      //   ];
      // });

      // form submit
      this.submitted = false;
    });
  }
}
