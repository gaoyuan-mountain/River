import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'button', pathMatch: 'full' },
  { path: 'button', loadChildren: 'app/button/button-demo.module#ButtonDemoModule' },
  { path: 'sidenav', loadChildren: 'app/sidenav/sidenav-demo.module#SidenavDemoModule' },
  { path: 'toolbar', loadChildren: 'app/toolbar/toolbar-demo.module#ToolbarDemoModule' }
]

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
