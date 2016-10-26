import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RvIconRegistry } from '../../../components/icon';

@Component({
  selector: 'demo-button',
  templateUrl: './button-demo.html',
  styles: [
    require('./button-demo.scss')
  ]
})
export class ButtonDemoComponent {
  constructor(private router: Router, rvIconRegistry: RvIconRegistry) {
    rvIconRegistry.addSvgIcon('menu', require('../../public/svg/menu.svg'))
  }
}
