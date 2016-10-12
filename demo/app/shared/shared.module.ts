import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { RiverModule } from '../../../components/river.module';

@NgModule({
  imports: [ CommonModule, RiverModule.forRoot() ],
  declarations: [ ],
  exports: [ CommonModule, HttpModule, RiverModule ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
