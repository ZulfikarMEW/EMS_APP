import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import {
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbTimepickerModule,
  NgbDropdownModule,
} from "@ng-bootstrap/ng-bootstrap";

import { PagetitleComponent } from "./pagetitle/pagetitle.component";
import { LoaderComponent } from "./loader/loader.component";
import { EmployeefilterComponent } from "./employeefilter/employeefilter.component";
import { ListheaderComponent } from "./listheader/listheader.component";
import { Page403Component } from "./page403/page403.component";
import { PersonalDataFilterComponent } from "./personal-data-filter/personal-data-filter.component";
import { ColumnSelectorComponent } from "./column-selector/column-selector.component";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    PagetitleComponent,
    LoaderComponent,
    EmployeefilterComponent,
    ListheaderComponent,
    Page403Component,
    PersonalDataFilterComponent,
    ColumnSelectorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    NgbDropdownModule,
    TranslateModule,
  ],
  exports: [
    PagetitleComponent,
    LoaderComponent,
    EmployeefilterComponent,
    ListheaderComponent,
    PersonalDataFilterComponent,
    ColumnSelectorComponent,
  ],
})
export class UIModule {}
