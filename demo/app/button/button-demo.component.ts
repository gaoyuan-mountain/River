import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'demo-button',
  template: `
    <rv-button></rv-button>
  `,
  styles: []
})
export class ButtonDemoComponent {
  constructor(private router: Router) { }
}
