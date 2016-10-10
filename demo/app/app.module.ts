import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { routing } from './app.routing';

import '../public/styles/common.scss';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    CoreModule.forRoot({}),
    routing
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
