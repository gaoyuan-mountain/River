import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { routing } from './button-demo.routing';
import { ButtonDemoComponent } from './button-demo.component';

@NgModule({
  imports: [ SharedModule, routing, CommonModule ],
  declarations: [ ButtonDemoComponent ],
  providers: []
})
export class ButtonDemoModule { }
