import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'demo-icon',
  templateUrl: './icon-demo.html',
  styles: [
    require('./icon-demo.scss')
  ]
})
export class IconDemoComponent {
  constructor(private router: Router) { }
}
