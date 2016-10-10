import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { routing } from './login.routing';
import { ButtonModule } from '../../../components/button/button.module';

@NgModule({
  imports: [ SharedModule, routing, ButtonModule ],
  declarations: [],
  providers: []
})
export class ButtonDemoModule { }
