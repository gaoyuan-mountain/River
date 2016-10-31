import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'demo-checkbox',
  templateUrl: './checkbox-demo.html',
  styles: [
    require('./checkbox-demo.scss')
  ]
})
export class CheckboxDemoComponent {
  constructor(private router: Router) { }

  isIndeterminate: boolean = false;
  isChecked: boolean = false;
  isDisabled: boolean = false;
  alignment: string = 'start';
  useAlternativeColor: boolean = false;

  checkboxColor() {
    return this.useAlternativeColor ? 'primary' : 'accent';
  }
}
