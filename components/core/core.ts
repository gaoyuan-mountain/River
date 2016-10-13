import { NgModule, ModuleWithProviders } from '@angular/core';
import { RtlModule } from './rtl/dir';

// RTL
export { Dir, LayoutDirection, RtlModule } from './rtl/dir';

// Error
export { RvError } from './error/error';

@NgModule({
  imports: [ RtlModule ],
  exports: [ RtlModule ],
})
export class RvCoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RvCoreModule,
      providers: [],
    };
  }
}
