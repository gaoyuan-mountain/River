import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SidenavDemoComponent } from './sidenav-demo.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'sidenav', component: SidenavDemoComponent }
])
