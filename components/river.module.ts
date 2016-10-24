import { NgModule, ModuleWithProviders } from '@angular/core';

import { RvButtonModule } from './button';
import { RvSidenavModule } from './sidenav';
import { RvToolbarModule } from './toolbar';
import { RvIconModule } from './icon';

const RIVER_MODULES = [
  RvButtonModule,
  RvSidenavModule,
  RvToolbarModule,
  RvIconModule
];

@NgModule({
  imports: [
    RvButtonModule.forRoot(),
    RvSidenavModule.forRoot(),
    RvToolbarModule.forRoot(),
    RvIconModule.forRoot()
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
