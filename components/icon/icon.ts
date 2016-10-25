import {
  NgModule,
  ModuleWithProviders,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer,
  SimpleChange,
  ViewEncapsulation,
  AfterViewChecked
} from '@angular/core';
import { HttpModule } from '@angular/http';
import { RvError } from '../core';
import { RvIconRegistry } from './icon-registry';
export { RvIconRegistry } from './icon-registry';

export class RvIconInvalidNameError extends RvError {
  constructor(iconName: string) {
    super(`Invalid icon name: "${iconName}"`);
  }
}

@Component({
  template: `<ng-content></ng-content>`,
  selector: 'rv-icon',
  styles: [
    require('./icon.scss')
  ],
  host: {
    'role': 'img'
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RvIcon implements OnChanges, OnInit, AfterViewChecked {
  @Input() svgSrc: string;
  @Input() svgIcon: string;
  @Input() fontSet: string;
  @Input() fontIcon: string;
  @Input() alt: string;
  @Input('aria-label') hostAriaLabel: string = '';

  private _previousFontSetClass: string;
  private _previousFontIconClass: string;

  constructor(
    private _element: ElementRef,
    private _renderer: Renderer,
    private _rvIconRegistry: RvIconRegistry
  ) { }

  private _splitIconName(iconName: string): [string, string] {
    if (!iconName) {
      return ['', ''];
    }

    const parts = iconName.split(':');
    switch (parts.length) {
      case 1:
        return ['', parts[0]];
      case 2:
        return <[string, string]>parts;
      default:
        throw new RvIconInvalidNameError(iconName);
    }
  }

  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    const changedInputs = Object.keys(changes);
    if (changedInputs.indexOf('svgIcon') != -1 || changedInputs.indexOf('svgSrc') != -1) {
      if (this.svgIcon) {
        const [namespace, iconName] = this._splitIconName(this.svgIcon);
        this._rvIconRegistry.getNamedSvgIcon(iconName, namespace).first().subscribe(
          svg => this._setSvgElement(svg),
          (err: any) => console.log(`Error retrieving icon: ${err}`)
        );
      } else if (this.svgSrc) {
        this._rvIconRegistry.getSvgIconFromUrl(this.svgSrc).first().subscribe(
          svg => this._setSvgElement(svg),
          (err: any) => console.log(`Error retrieving icon: ${err}`)
        )
      }
    }

    if (this._usingFontIcon()) {
      this._updateFontIconClasses();
    }

    this._updateAriaLabel();
  }

  ngOnInit() {
    if (this._usingFontIcon()) {
      this._updateFontIconClasses()
    }
  }

  ngAfterViewChecked() {
    this._updateAriaLabel();
  }

  private _updateAriaLabel() {
    const ariaLabel = this._getAriaLabel();
    if (ariaLabel) {
      this._renderer.setElementAttribute(this._element.nativeElement, 'aria-label', ariaLabel);
    }
  }

  private _getAriaLabel() {
    const label =
      this.hostAriaLabel ||
      this.alt ||
      this.fontIcon ||
      this._splitIconName(this.svgIcon)[1];
    if (label) {
      return label;
    }

    if (this._usingFontIcon()) {
      const text = this._element.nativeElement.textContent;
      if (text) {
        return text
      }
    }

    return null;
  }

  private _usingFontIcon(): boolean {
    return !(this.svgIcon || this.svgSrc);
  }

  private _setSvgElement(svg: SVGElement) {
    const layoutElement = this._element.nativeElement;
    layoutElement.innerHTML = '';
    this._renderer.projectNodes(layoutElement, [svg]);
  }

  private _updateFontIconClasses() {
    if (!this._usingFontIcon()) {
      return;
    }

    const elem = this._element.nativeElement;
    const fontSetClass = this.fontSet ?
      this._rvIconRegistry.classNameForFontAlias(this.fontSet) :
      this._rvIconRegistry.getDefaultFontSetClass();

    if (fontSetClass != this._previousFontSetClass) {
      if (this._previousFontSetClass) {
        this._renderer.setElementClass(elem, this._previousFontSetClass, false);
      }

      if (fontSetClass) {
        this._renderer.setElementClass(elem, fontSetClass, true);
      }

      this._previousFontSetClass = fontSetClass;
    }

    if (this.fontIcon != this._previousFontIconClass) {
      if (this._previousFontIconClass) {
        this._renderer.setElementClass(elem, this._previousFontIconClass, false);
      }

      if (this.fontIcon) {
        this._renderer.setElementClass(elem, this.fontIcon, true);
      }

      this._previousFontIconClass = this.fontIcon;
    }
  }
}

@NgModule({
  imports: [HttpModule],
  exports: [RvIcon],
  declarations: [RvIcon]
})
export class RvIconModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RvIconModule,
      providers: [RvIconRegistry]
    }
  }
}
