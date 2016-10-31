import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CheckboxDemoComponent } from './checkbox-demo.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'checkbox', component: CheckboxDemoComponent }
])
