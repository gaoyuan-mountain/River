import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { routing } from './sidenav-demo.routing';
import { SidenavDemoComponent } from './sidenav-demo.component';

@NgModule({
  imports: [ SharedModule, routing, CommonModule ],
  declarations: [ SidenavDemoComponent ],
  providers: []
})
export class SidenavDemoModule { }
