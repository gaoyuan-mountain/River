import {
  NgModule,
  ModuleWithProviders,
  Directive,
  HostBinding,
  Output,
  Input,
  EventEmitter
} from '@angular/core';

export type LayoutDirection = 'ltr' | 'rtl';

/**
 * Directive to listen to changes of direction of part of DOM.
 *
 * Applications should use this directive instead of the native attribute so that River
 * components can listen on changes of direction
 */
@Directive({
  selector: '[dir]',
  exportAs: '$implicit'
})
export class Dir {
  @Input('dir') _dir: LayoutDirection = 'ltr';

  @Input() dirChange = new EventEmitter<void>();

  @HostBinding('attr.dir')
  get dir(): LayoutDirection {
    return this._dir;
  }
  set dir(v: LayoutDirection) {
    let old = this._dir;
    this._dir = v;
    if (old != this._dir) {
      this.dirChange.emit(null);
    }
  }

  get value(): LayoutDirection {
    return this.dir;
  }
  set value(v: LayoutDirection) {
    this.dir = v;
  }
}

NgModule({
  exports: [ Dir ],
  declarations: [ Dir ]
})
export class RtlModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RtlModule,
      providers: []
    };
  }
}
