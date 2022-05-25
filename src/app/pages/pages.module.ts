import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { DualListBoxModule } from "ng2-dual-selector";

import {
  NgbNavModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbTooltipModule,
  NgbCollapseModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgApexchartsModule } from "ng-apexcharts";
import { FullCalendarModule } from "@fullcalendar/angular";
import { SimplebarAngularModule } from "simplebar-angular";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin
import interactionPlugin from "@fullcalendar/interaction"; // a plugin
import bootstrapPlugin from "@fullcalendar/bootstrap";
// import { LightboxModule } from "ngx-lightbox";

import { WidgetModule } from "../shared/widget/widget.module";
import { UIModule } from "../shared/ui/ui.module";

import { PagesRoutingModule } from "./pages-routing.module";

import { DashboardsModule } from "./dashboards/dashboards.module";
// import { EcommerceModule } from "./ecommerce/ecommerce.module";
// import { CryptoModule } from "./crypto/crypto.module";
import { EmailModule } from "./email/email.module";
import { InvoicesModule } from "./invoices/invoices.module";
import { ProjectsModule } from "./projects/projects.module";
import { TasksModule } from "./tasks/tasks.module";
import { ContactsModule } from "./contacts/contacts.module";
import { BlogModule } from "./blog/blog.module";
import { UtilityModule } from "./utility/utility.module";
import { UiModule } from "./ui/ui.module";
import { FormModule } from "./form/form.module";
import { TablesModule } from "./tables/tables.module";
import { IconsModule } from "./icons/icons.module";
import { ChartModule } from "./chart/chart.module";
// import { CalendarComponent } from "./calendar/calendar.component";
import { MapsModule } from "./maps/maps.module";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
// import { ChatComponent } from "./chat/chat.component";

import { NgbProgressbarModule } from "@ng-bootstrap/ng-bootstrap";

// import { FilemanagerComponent } from "./filemanager/filemanager.component";
import { EmployeeListComponent } from "./employee/employee-list/employee-list.component";
import { RolesComponent } from "./employee/roles/roles.component";
import { ProfileComponent } from "./employee/profile/profile.component";
// import { LeaveReturnComponent } from "./Request/leave-return/leave-return.component";
// import { LeaveComponent } from "./Request/leave/leave.component";
// import { ApproveleaveComponent } from "./approval/approveleave/approveleave.component";
// import { LeavereportComponent } from "./approval/leavereport/leavereport.component";
import { TranslateModule } from "@ngx-translate/core";
// import { LeaveCalendarComponent } from "./approval/leave-calendar/leave-calendar.component";
import { JobDegreeComponent } from "./masters/job-degree/job-degree.component";
import { GradeComponent } from "./masters/grade/grade.component";
import { QualificationComponent } from "./masters/qualification/qualification.component";
import { DesignationComponent } from "./masters/designation/designation.component";
import { JobDescriptionComponent } from "./masters/job-description/job-description.component";
import { ContractTypeComponent } from "./masters/contract-type/contract-type.component";
import { BudgetTypeComponent } from "./masters/budget-type/budget-type.component";
import { JobLevelComponent } from "./masters/job-level/job-level.component";
import { FunctionalGroupComponent } from "./masters/functional-group/functional-group.component";
import { ProgramComponent } from "./masters/program/program.component";
import { SectorComponent } from "./masters/sector/sector.component";
import { DepartmentComponent } from "./masters/department/department.component";
import { AnnualEvaluationComponent } from "./masters/annual-evaluation/annual-evaluation.component";
import { VacationComponent } from "./masters/vacation/vacation.component";
import { AllowanceTypeComponent } from "./masters/allowance-type/allowance-type.component";
import { NationalityComponent } from "./masters/nationality/nationality.component";
import { ReasonForRetirementComponent } from "./masters/reason-for-retirement/reason-for-retirement.component";
import { SocialStatusComponent } from "./masters/social-status/social-status.component";
import { UserComponent } from "./employee/user/user.component";
import { PersonalDataComponent } from "./personal/personal-data/personal-data.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { JobTitleComponent } from "./masters/job-title/job-title.component";
import { ReasonForPromotionComponent } from "./masters/reason-for-promotion/reason-for-promotion.component";
import { GenderComponent } from "./masters/gender/gender.component";
import { AddqualificationComponent } from "./personal/addqualification/addqualification.component";
import { PreviosExperienceComponent } from "./personal/previos-experience/previos-experience.component";
import { WorkPlacesComponent } from "./masters/work-places/work-places.component";
import { PromotionComponent } from "./personal/promotion/promotion.component";
import { ChangeJobTitleComponent } from "./personal/change-job-title/change-job-title.component";
import { UploadComponent } from "./bonus/upload/upload.component";
import { BonusadjustmentComponent } from "./bonus/bonusadjustment/bonusadjustment.component";
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { NgxDropzoneModule } from "ngx-dropzone";
import { BonusamountmappingComponent } from "./settings/bonusamountmapping/bonusamountmapping.component";
import { CalculateBonusComponent } from "./bonus/calculate-bonus/calculate-bonus.component";
import { NgxPrintModule } from "ngx-print";
import { CustomReportComponent } from "./personal/custom-report/custom-report.component";
import { PersonalEvaluationComponent } from "./personal/personal-evaluation/personal-evaluation.component";
import { ManualentryComponent } from "./bonus/manualentry/manualentry.component";
import { StrengthCheckerComponent } from "./employee/strength-checker.component";
import { CustomBonusReportComponent } from "./bonus/custom-bonus-report/custom-bonus-report.component";
// import { LazyForDirective } from "../core/directives/lazyFor.directive";
// import { NgxMaskModule, IConfig } from "ngx-mask";

import { ScrollingModule } from "@angular/cdk/scrolling";

FullCalendarModule.registerPlugins([
  // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  bootstrapPlugin,
]);

// export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [
    // CalendarComponent,
    // ChatComponent,
    // FilemanagerComponent,
    EmployeeListComponent,
    RolesComponent,
    ProfileComponent,
    // LeaveComponent,
    // LeaveReturnComponent,
    // ApproveleaveComponent,
    // LeavereportComponent,
    // LeaveCalendarComponent,
    JobDegreeComponent,
    GradeComponent,
    QualificationComponent,
    DesignationComponent,
    JobDescriptionComponent,
    ContractTypeComponent,
    BudgetTypeComponent,
    JobLevelComponent,
    FunctionalGroupComponent,
    ProgramComponent,
    SectorComponent,
    DepartmentComponent,
    AnnualEvaluationComponent,
    VacationComponent,
    AllowanceTypeComponent,
    NationalityComponent,
    ReasonForRetirementComponent,
    WorkPlacesComponent,
    SocialStatusComponent,
    UserComponent,
    PersonalDataComponent,
    JobTitleComponent,
    ReasonForPromotionComponent,
    GenderComponent,
    AddqualificationComponent,
    PreviosExperienceComponent,
    WorkPlacesComponent,
    PromotionComponent,
    ChangeJobTitleComponent,
    UploadComponent,
    BonusadjustmentComponent,
    BonusamountmappingComponent,
    CalculateBonusComponent,
    CustomReportComponent,
    PersonalEvaluationComponent,
    ManualentryComponent,
    StrengthCheckerComponent,
    CustomBonusReportComponent,
    // LazyForDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    NgbModalModule,
    PagesRoutingModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    DashboardsModule,
    NgbProgressbarModule,
    NgSelectModule,
    NgxPrintModule,
    // CryptoModule,
    // EcommerceModule,
    EmailModule,
    InvoicesModule,
    HttpClientModule,
    ProjectsModule,
    UIModule,
    TasksModule,
    ContactsModule,
    BlogModule,
    UtilityModule,
    UiModule,
    FormModule,
    TablesModule,
    IconsModule,
    ChartModule,
    WidgetModule,
    MapsModule,
    FullCalendarModule,
    NgbNavModule,
    NgbTooltipModule,
    NgbCollapseModule,
    SimplebarAngularModule,
    // LightboxModule,
    TranslateModule,
    DropzoneModule,
    NgxDropzoneModule,
    ScrollingModule,
    // NgxMaskModule.forRoot(),
  ],
})
export class PagesModule {}
