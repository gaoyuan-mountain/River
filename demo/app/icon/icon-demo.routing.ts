import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IconDemoComponent } from './icon-demo.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'icon', component: IconDemoComponent }
])
