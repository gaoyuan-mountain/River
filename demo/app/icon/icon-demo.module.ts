import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { routing } from './icon-demo.routing';
import { IconDemoComponent } from './icon-demo.component';

@NgModule({
  imports: [ SharedModule, routing, CommonModule ],
  declarations: [ IconDemoComponent ],
  providers: []
})
export class IconDemoModule { }
