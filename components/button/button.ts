import {
  Component,
  ViewEncapsulation,
  Input,
  HostBinding,
  ChangeDetectionStrategy,
  ElementRef,
  Renderer,
  NgModule,
  ModuleWithProviders
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'rv-button, button[rv-button]',
  templateUrl: 'button.html',
  styles: [
    // require('./button.scss')
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RvButton {
  constructor() { }
}

@NgModule({
  imports: [ CommonModule ],
  exports: [ RvButton ],
  declarations: [ RvButton ]
})
export class RvButtonModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RvButtonModule,
      providers: []
    }
  }
}
