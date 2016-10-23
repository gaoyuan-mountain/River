import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { routing } from './toolbar-demo.routing';
import { ToolbarDemoComponent } from './toolbar-demo.component';

@NgModule({
  imports: [ SharedModule, routing, CommonModule ],
  declarations: [ ToolbarDemoComponent ],
  providers: []
})
export class ToolbarDemoModule { }
