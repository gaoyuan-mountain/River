import { NgModule, ModuleWithProviders } from '@angular/core';

import { RvButtonModule } from './button';
import { RvSidenavModule } from './sidenav';

const RIVER_MODULES = [
  RvButtonModule,
  RvSidenavModule
];

@NgModule({
  imports: [
    RvButtonModule.forRoot(),
    RvSidenavModule.forRoot()
  ],
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
