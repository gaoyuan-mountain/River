import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';

import { RiverModule } from '../../../components/river.module';

@NgModule({
  imports: [ CommonModule, RiverModule.forRoot(), FormsModule ],
  declarations: [ ],
  exports: [ CommonModule, HttpModule, RiverModule, FormsModule ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
