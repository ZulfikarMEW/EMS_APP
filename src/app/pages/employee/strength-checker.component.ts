import {
  Component,
  Input,
  OnChanges,
  SimpleChange,
  Output,
  EventEmitter,
} from "@angular/core";

@Component({
  selector: "strength-checker",
  template: `<div class="strength">
    {{ barLabel }}&nbsp;
    <ul class="strengthBar">
      <li class="point" [style.background-color]="bar0"></li>
      <li class="point" [style.background-color]="bar1"></li>
      <li class="point" [style.background-color]="bar2"></li>
      <li class="point" [style.background-color]="bar3"></li>
    </ul>
    <!-- &nbsp; -->
    <br />
    <span [class]="setmsgColor(msg)" *ngIf="msg">{{ msg }}</span>
  </div>`,
  styles: [
    `
      .strengthBar {
        display: inline;
        list-style: none;
        margin: 0;
        padding: 0;
        vertical-align: 2px;
      }

      .point:last-of-type {
        margin: 0 !important;
      }

      .point {
        background: #ddd;
        border-radius: 2px;
        display: inline-block;
        height: 5px;
        margin-right: 1px;
        width: 40px;
      }
    `,
  ],
})
export class StrengthCheckerComponent implements OnChanges {
  @Input() public passwordToVerify: string;
  @Input() public barLabel: string;
  @Output() passwordStrength = new EventEmitter<boolean>();
  bar0: string;
  bar1: string;
  bar2: string;
  bar3: string;

  msg = "";

  private colors = ["darkred", "orangered", "orange", "yellowgreen"];

  private static checkStrength(p) {
    let force = 0;
    const regex = /[$-/:-?{-~!"^_@`\[\]]/g;

    const lowerLetters = /[a-z]+/.test(p);
    const upperLetters = /[A-Z]+/.test(p);
    const numbers = /[0-9]+/.test(p);
    const symbols = regex.test(p);

    const flags = [lowerLetters, upperLetters, numbers, symbols];

    let passedMatches = 0;
    for (const flag of flags) {
      passedMatches += flag === true ? 1 : 0;
    }

    force += 2 * p.length + (p.length >= 10 ? 1 : 0);
    force += passedMatches * 10;

    // short password
    force = p.length <= 5 ? Math.min(force, 10) : force;

    // poor variety of characters
    force = passedMatches === 1 ? Math.min(force, 10) : force;
    force = passedMatches === 2 ? Math.min(force, 20) : force;
    force = passedMatches === 3 ? Math.min(force, 30) : force;
    force = passedMatches === 4 ? Math.min(force, 40) : force;

    return force;
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password = changes.passwordToVerify.currentValue;
    this.setBarColors(4, "#DDD");
    if (password) {
      const c = this.getColor(StrengthCheckerComponent.checkStrength(password));
      this.setBarColors(c.idx, c.col);

      const pwdStrength = StrengthCheckerComponent.checkStrength(password);
      pwdStrength === 40
        ? this.passwordStrength.emit(true)
        : this.passwordStrength.emit(false);

      switch (c.idx) {
        case 1:
          this.msg = "Poor";
          break;
        case 2:
          this.msg = "Not Good";
          break;
        case 3:
          this.msg = "Average";
          break;
        case 4:
          this.msg = "Good";
          break;
      }
    } else {
      this.msg = "";
    }
  }

  private getColor(s) {
    let idx = 0;
    if (s <= 10) {
      idx = 0;
    } else if (s <= 20) {
      idx = 1;
    } else if (s <= 30) {
      idx = 2;
    } else if (s <= 40) {
      idx = 3;
    } else {
      idx = 4;
    }
    return {
      idx: idx + 1,
      col: this.colors[idx],
    };
  }

  private setBarColors(count, col) {
    for (let n = 0; n < count; n++) {
      this["bar" + n] = col;
    }
  }

  setmsgColor(msg): string {
    let className: string = "";
    switch (msg) {
      case "Poor":
        className = "badge rounded-pill bg-danger";
        break;
      case "Not Good":
        className = "badge rounded-pill bg-info";
        break;
      case "Average":
        className = "badge rounded-pill bg-warning";
        break;
      case "Good":
        className = "badge rounded-pill bg-success";
        break;
    }

    return className;
  }
}
