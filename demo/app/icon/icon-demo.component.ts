import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RvIconRegistry } from '../../../components/icon';

@Component({
  selector: 'demo-icon',
  templateUrl: './icon-demo.html',
  styles: [
    require('./icon-demo.scss')
  ],
  viewProviders: [RvIconRegistry]
})
export class IconDemoComponent {
  constructor(private router: Router, rvIconRegistry: RvIconRegistry) {
    rvIconRegistry.addSvgIcon('thumb-up', require('./assets/thumbup-icon.svg'))
  }
}
