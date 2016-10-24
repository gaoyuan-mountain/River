import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ToolbarDemoComponent } from './toolbar-demo.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'toolbar', component: ToolbarDemoComponent }
])
