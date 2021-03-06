import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ButtonDemoModule } from './button/button-demo.module';
import { SidenavDemoModule } from './sidenav/sidenav-demo.module';
import { ToolbarDemoModule } from './toolbar/toolbar-demo.module';
import { IconDemoModule } from './icon/icon-demo.module';
import { CheckboxDemoModule } from './checkbox/checkbox-demo.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { routing } from './app.routing';

import '../public/styles/common.scss';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule.forRoot(),
    ButtonDemoModule,
    SidenavDemoModule,
    ToolbarDemoModule,
    IconDemoModule,
    CheckboxDemoModule,
    CoreModule.forRoot({}),
    routing
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
