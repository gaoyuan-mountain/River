import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'button', pathMatch: 'full' },
  { path: 'button', loadChildren: 'demo/app/button/button-demo.module#ButtonDemoModule' }
]

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
