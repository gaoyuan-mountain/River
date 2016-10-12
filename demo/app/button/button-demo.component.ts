import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'demo-button',
  template: `
    <a rv-button>abc</a>
  `,
  styles: []
})
export class ButtonDemoComponent {
  constructor(private router: Router) { }
}
