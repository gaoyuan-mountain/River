import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'demo-button',
  templateUrl: './button-demo.html',
  styles: [
    require('./button-demo.scss')
  ]
})
export class ButtonDemoComponent {
  constructor(private router: Router) { }
}
