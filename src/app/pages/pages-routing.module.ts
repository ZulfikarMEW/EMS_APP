import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// import { CalendarComponent } from "./calendar/calendar.component";
// import { ChatComponent } from "./chat/chat.component";
import { DefaultComponent } from "./dashboards/default/default.component";
// import { EmployeeListComponent } from "./employee/employee-list/employee-list.component";
// import { ProfileComponent } from "./employee/profile/profile.component";
import { RolesComponent } from "./employee/roles/roles.component";
// import { FilemanagerComponent } from "./filemanager/filemanager.component";
// import { LeaveReturnComponent } from "./Request/leave-return/leave-return.component";
// import { LeaveComponent } from "./Request/leave/leave.component";
// import { ApproveleaveComponent } from "./approval/approveleave/approveleave.component";
// import { LeavereportComponent } from "./approval/leavereport/leavereport.component";
import { AuthGuard } from "../core/guards/auth.guard";
// import { LeaveCalendarComponent } from "./approval/leave-calendar/leave-calendar.component";
import { JobDegreeComponent } from "./masters/job-degree/job-degree.component";
import { GradeComponent } from "./masters/grade/grade.component";
import { QualificationComponent } from "./masters/qualification/qualification.component";
import { UserComponent } from "./employee/user/user.component";
import { FunctionalGroupComponent } from "./masters/functional-group/functional-group.component";
import { BudgetTypeComponent } from "./masters/budget-type/budget-type.component";
import { DesignationComponent } from "./masters/designation/designation.component";
import { ContractTypeComponent } from "./masters/contract-type/contract-type.component";
import { JobLevelComponent } from "./masters/job-level/job-level.component";
import { JobDescriptionComponent } from "./masters/job-description/job-description.component";
import { ProgramComponent } from "./masters/program/program.component";
import { SectorComponent } from "./masters/sector/sector.component";
import { DepartmentComponent } from "./masters/department/department.component";
import { AnnualEvaluationComponent } from "./masters/annual-evaluation/annual-evaluation.component";
import { VacationComponent } from "./masters/vacation/vacation.component";
import { AllowanceTypeComponent } from "./masters/allowance-type/allowance-type.component";
import { NationalityComponent } from "./masters/nationality/nationality.component";
import { ReasonForRetirementComponent } from "./masters/reason-for-retirement/reason-for-retirement.component";
import { SocialStatusComponent } from "./masters/social-status/social-status.component";
import { PersonalDataComponent } from "./personal/personal-data/personal-data.component";
import { JobTitleComponent } from "./masters/job-title/job-title.component";
import { ReasonForPromotionComponent } from "./masters/reason-for-promotion/reason-for-promotion.component";
import { AddqualificationComponent } from "./personal/addqualification/addqualification.component";
import { PreviosExperienceComponent } from "./personal/previos-experience/previos-experience.component";
import { WorkPlacesComponent } from "./masters/work-places/work-places.component";
import { PromotionComponent } from "./personal/promotion/promotion.component";
import { ChangeJobTitleComponent } from "./personal/change-job-title/change-job-title.component";
import { UploadComponent } from "./bonus/upload/upload.component";
import { BonusadjustmentComponent } from "./bonus/bonusadjustment/bonusadjustment.component";
import { BonusamountmappingComponent } from "./settings/bonusamountmapping/bonusamountmapping.component";
import { CalculateBonusComponent } from "./bonus/calculate-bonus/calculate-bonus.component";
import { CustomReportComponent } from "./personal/custom-report/custom-report.component";
import { PersonalEvaluationComponent } from "./personal/personal-evaluation/personal-evaluation.component";
import { ManualentryComponent } from "./bonus/manualentry/manualentry.component";
import { CustomBonusReportComponent } from "./bonus/custom-bonus-report/custom-bonus-report.component";

const routes: Routes = [
  { path: "", redirectTo: "dashboard", canActivate: [AuthGuard] },

  { path: "dashboard", component: DefaultComponent, canActivate: [AuthGuard] },
  // { path: "calendar", component: CalendarComponent },
  {
    path: "users",
    component: UserComponent,
    canActivate: [AuthGuard],
  },
  { path: "roles", component: RolesComponent, canActivate: [AuthGuard] },
  // { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  // { path: "chat", component: ChatComponent },
  // {
  //   path: "request/leave",
  //   component: LeaveComponent,
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: "request/leavereturn",
  //   component: LeaveReturnComponent,
  //   canActivate: [AuthGuard],
  // },
  {
    path: "masters/jobdegree",
    component: JobDegreeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "masters/grade",
    component: GradeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "masters/qualification",
    component: QualificationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "masters/functionalgroup",
    component: FunctionalGroupComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "masters/budgettype",
    component: BudgetTypeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "masters/designation",
    component: DesignationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "masters/contracttype",
    component: ContractTypeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "masters/joblevel",
    component: JobLevelComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "masters/jobtitle",
    component: JobTitleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "masters/jobdescription",
    component: JobDescriptionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "masters/program",
    component: ProgramComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "masters/sector",
    component: SectorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "masters/department",
    component: DepartmentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "masters/annualevaluation",
    component: AnnualEvaluationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "masters/vacation",
    component: VacationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "masters/allowancetype",
    component: AllowanceTypeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "masters/nationality",
    component: NationalityComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "masters/reasonforpromotion",
    component: ReasonForPromotionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "masters/workplace",
    component: WorkPlacesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "masters/socialstatus",
    component: SocialStatusComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "masters/reasonforretirement",
    component: ReasonForRetirementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "personal/personaldata",
    component: PersonalDataComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "personal/qualification",
    component: AddqualificationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "personal/experience",
    component: PreviosExperienceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "personal/promotion",
    component: PromotionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "personal/annualevaluationdata",
    component: PersonalEvaluationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "personal/changejobtitle",
    component: ChangeJobTitleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "bonus/upload",
    component: UploadComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "bonus/bonusadjustment",
    component: BonusadjustmentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "bonus/calculate",
    component: CalculateBonusComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "bonus/manualentry",
    component: ManualentryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "settings/bonusamountmapping",
    component: BonusamountmappingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "personal/customreport",
    component: CustomReportComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "bonus/customreport",
    component: CustomBonusReportComponent,
    canActivate: [AuthGuard],
  },
  // {
  //   path: "approval/leave",
  //   component: ApproveleaveComponent,
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: "approval/leavecalendar",
  //   component: LeaveCalendarComponent,
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: "leave/report",
  //   component: LeavereportComponent,
  //   canActivate: [AuthGuard],
  // },
  // { path: "filemanager", component: FilemanagerComponent },
  {
    path: "dashboards",
    loadChildren: () =>
      import("./dashboards/dashboards.module").then((m) => m.DashboardsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "ecommerce",
    loadChildren: () =>
      import("./ecommerce/ecommerce.module").then((m) => m.EcommerceModule),
  },
  {
    path: "crypto",
    loadChildren: () =>
      import("./crypto/crypto.module").then((m) => m.CryptoModule),
  },
  {
    path: "email",
    loadChildren: () =>
      import("./email/email.module").then((m) => m.EmailModule),
  },
  {
    path: "invoices",
    loadChildren: () =>
      import("./invoices/invoices.module").then((m) => m.InvoicesModule),
  },
  {
    path: "projects",
    loadChildren: () =>
      import("./projects/projects.module").then((m) => m.ProjectsModule),
  },
  {
    path: "tasks",
    loadChildren: () =>
      import("./tasks/tasks.module").then((m) => m.TasksModule),
  },
  {
    path: "contacts",
    loadChildren: () =>
      import("./contacts/contacts.module").then((m) => m.ContactsModule),
  },
  {
    path: "blog",
    loadChildren: () => import("./blog/blog.module").then((m) => m.BlogModule),
  },
  {
    path: "pages",
    loadChildren: () =>
      import("./utility/utility.module").then((m) => m.UtilityModule),
  },
  {
    path: "ui",
    loadChildren: () => import("./ui/ui.module").then((m) => m.UiModule),
  },
  {
    path: "form",
    loadChildren: () => import("./form/form.module").then((m) => m.FormModule),
  },
  {
    path: "tables",
    loadChildren: () =>
      import("./tables/tables.module").then((m) => m.TablesModule),
  },
  {
    path: "icons",
    loadChildren: () =>
      import("./icons/icons.module").then((m) => m.IconsModule),
  },
  {
    path: "charts",
    loadChildren: () =>
      import("./chart/chart.module").then((m) => m.ChartModule),
  },
  {
    path: "maps",
    loadChildren: () => import("./maps/maps.module").then((m) => m.MapsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
