import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'demo-sidenav',
  templateUrl: './sidenav-demo.html',
  styles: [
    require('./sidenav-demo.scss')
  ]
})
export class SidenavDemoComponent {
  constructor(private router: Router) { }
}
