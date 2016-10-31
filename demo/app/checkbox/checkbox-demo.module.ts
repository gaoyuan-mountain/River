import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { routing } from './checkbox-demo.routing';
import { CheckboxDemoComponent } from './checkbox-demo.component';

@NgModule({
  imports: [ SharedModule, routing, CommonModule ],
  declarations: [ CheckboxDemoComponent ],
  providers: []
})
export class CheckboxDemoModule { }
