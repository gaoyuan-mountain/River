import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RvIconRegistry } from '../../../components/icon';

@Component({
  selector: 'demo-toolbar',
  templateUrl: './toolbar-demo.html',
  styles: [
    require('./toolbar-demo.scss')
  ]
})
export class ToolbarDemoComponent {
  constructor(private router: Router, rvIconRegistry: RvIconRegistry) {
    rvIconRegistry.addSvgIcon('menu', require('../../public/svg/menu.svg'))
  }
}
