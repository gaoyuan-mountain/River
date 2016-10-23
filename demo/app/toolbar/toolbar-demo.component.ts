import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'demo-toolbar',
  templateUrl: './toolbar-demo.html',
  styles: [
    require('./toolbar-demo.scss')
  ]
})
export class ToolbarDemoComponent {
  constructor(private router: Router) { }
}
