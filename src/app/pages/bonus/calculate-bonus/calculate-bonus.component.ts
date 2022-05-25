import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-calculate-bonus",
  templateUrl: "./calculate-bonus.component.html",
  styleUrls: ["./calculate-bonus.component.scss"],
})
export class CalculateBonusComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  isStartedProcess: boolean = false;
  processMessage = "";

  constructor() {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Bonus" },
      { label: "Calculate Bonus", active: true },
    ];
  }

  startProcess() {}
}
