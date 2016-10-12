import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonDemoComponent } from './button-demo.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'button', component: ButtonDemoComponent }
])
