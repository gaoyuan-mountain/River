import {
  NgModule,
  ModuleWithProviders,
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation,
  Directive,
  Renderer,
  ElementRef
} from '@angular/core';


@Directive({
  selector: 'rv-toolbar-row'
})
export class RvToolbarRow {}

@Component({
  selector: 'rv-toolbar',
  templateUrl: './toolbar.html',
  styles: [
    require('./toolbar.scss')
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class RvToolbar {
  private _color: string;

  constructor(private elementRef: ElementRef, private renderer: Renderer) {}

  @Input()
  get color(): string {
    return this._color;
  }

  set color(value: string) {
    this._updateColor(value);
  }

  private _updateColor(newColor: string) {
    this._setElementColor(this._color, false);
    this._setElementColor(newColor, true);
    this._color = newColor;
  }

  private _setElementColor(color: string, isAdd: boolean) {
    if (color != null && color != '') {
      this.renderer.setElementClass(this.elementRef.nativeElement, `rv-${color}`, isAdd);
    }
  }
}

@NgModule({
  exports: [RvToolbar, RvToolbarRow],
  declarations: [RvToolbar, RvToolbarRow]
})
export class RvToolbarModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RvToolbarModule,
      providers: []
    }
  }
}
