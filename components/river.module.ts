import { NgModule, ModuleWithProviders } from '@angular/core';

import { RvButtonModule } from './button/index';

const RIVER_MODULES = [
  RvButtonModule
];

@NgModule({
  imports: [ RvButtonModule.forRoot() ],
  exports: RIVER_MODULES
})
export class RiverRootModule { }

@NgModule({
  imports: RIVER_MODULES,
  exports: RIVER_MODULES
})
export class RiverModule {
  static forRoot(): ModuleWithProviders {
    return { ngModule: RiverRootModule }
  }
}
