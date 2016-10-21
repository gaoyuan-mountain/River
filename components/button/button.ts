import { Component, ViewEncapsulation, OnChanges, ElementRef, NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from '@angular/common';

@Component({
  selector: '[rv-button]:not(a), [rv-raised-button]:not(a)',
  templateUrl: 'button.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    require('./button.scss')
  ]
})
export class RvButton {

  constructor() { }
}


@Component({
  selector: 'a[rv-button], a[rv-raised-button]',
  inputs: ['disabled'],
  templateUrl: 'button.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    '(click)': 'onClick($event)'
  },
  styles: [
    require('./button.scss')
  ]
})
export class RvAnchor extends RvButton implements OnChanges {
  tabIndex: number;
  _disabled: boolean;

  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value) {
    this._disabled = !!value && this.disabled !== false;
  }

  onClick(event: any) {
    if(this.disabled) {
      event.preventDefault();
    }
  }

  ngOnChanges(_: any) {
    this.tabIndex = this.disabled ? -1 : 0;
  }
}

@NgModule({
  imports: [ CommonModule ],
  exports: [ RvButton, RvAnchor ],
  declarations: [ RvButton, RvAnchor ]
})
export class RvButtonModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RvButtonModule,
      providers: []
    }
  }
}
