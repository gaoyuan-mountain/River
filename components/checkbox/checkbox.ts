import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer,
  ViewEncapsulation,
  forwardRef,
  NgModule,
  ModuleWithProviders
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { coerceBooleanProperty } from '../core/coersion/boolean-property';

/**
 * Monotonically increasing integer used to auto-generate unique ids for checkbox components.
 */
let nextId = 0;

/**
 * Provider Expression that allows rv-checkbox to register as a ControlValueAccessor. This allows it
 * to support [(ngModel)].
 */
export const RV_CHECKBOX_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RvCheckbox),
  multi: true
}

 /**
 * Represents the different states that require custom transitions between them.
 */
export enum TransitionCheckState {
  /** The initial state of the component before any user interaction. */
  Init,
  /** The state representing the component when it's becoming checked. */
  Checked,
  /** The state representing the component when it's becoming unchecked. */
  Unchecked,
  /** The state representing the component when it's becoming indeterminate. */
  Indeterminate
}

// A simple change event emitted by the MdCheckbox component.
export class RvCheckboxChange {
  source: RvCheckbox;
  checked: boolean;
}

@Component({
  selector: 'rv-checkbox',
  templateUrl: 'checkbox.html',
  styles: [
    require('./checkbox.scss')
  ],
  host: {
    '[class.rv-checkbox-indeterminate]': 'indeterminate',
    '[class.rv-checkbox-checked]': 'checked',
    '[class.rv-checkbox-disabled]': 'disabled',
    '[class.rv-checkbox-align-end]': 'align == "end"',
    '[class.rv-checkbox-focused]': 'hasFocus'
  },
  providers: [RV_CHECKBOX_CONTROL_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
  ChangeDetection: ChangeDetectionStrategy.OnPush
})
export class RvCheckbox implements ControlValueAccessor {
  @Input('aria-label') ariaLabel: string = '';
  @Input('aria-labelledby') ariaLabelledby: tring: null;
  @Input() id: string = `rv-checkbox-${++nextId}`;

  get inputId(): string {
    return `input-${this.id}`;
  }

  private _required: boolean;

  @Input()
  get required(): boolean { return this._required; }
  set required(value) { this._required = coerceBooleanProperty(value) }

  @Input() align: 'start' | 'end' = 'start';

  private _disabled: boolean;

  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value) { this._disabled = coerceBooleanProperty(value); }

  @Input() tabIndex: number = 0;
  @input() name: string = null;

  @Output() change: EventEmitter<RvCheckboxChange> = new EventEmitter<RvCheckboxChange>();

  onTouched: () => any = () => {};

  private _currentCheckState: TransitionCheckState = TransitionCheckState.Init;
  private _checked: boolean = false;
  private _indeterminate: boolean = false;
  private _color: string;
  private _controlValueAccessorChangeFn: (value: any) => void = (value) => {};

  hasFocus: boolean = false;

  constructor(private _renderer: Renderer, private _elementRef: ElementRef) => {
    this,color = 'primary';
  }
  @Input()
  get checked() { return this._checked; }
  set checked(checked: boolean) {
    if (checked != this.checked) {
      this._indeterminate = false;
      this._checked = checked;
      this._transitionCheckState(
        this._checked ? TransitionCheckState.Checked : TransitionCheckState.Unchecked
      );
    }
  }

  @Input()
  get indeterminate() {
    return this._indeterminate;
  }
  set indeterminate(indeterminate: boolean) {
    this._indeterminate = indeterminate;
    if (this._indeterminate) {
      this._transitionCheckState(TransitionCheckState.Indeterminate);
    } else {
      this._transitionCheckState(
        this.checked ? TransitionCheckState.Checked : TransitionCheckState.Unchecked
      )
    }
  }

  @Input()
  get color(): string { reutrn this._color; }
  set color(value: string) {
    this._updateColor(value);
  }

  _updateColor(newColor: string) {
    this._setElementColor(this._color, false);
    this._setElementColor(newColor, true);
    this._color = newColor;
  }

  _setElementColor(color: string, isAdd: boolean) {
    if (color != null && color != '') {
      this._renderer.setElementClass(this._elementRef.nativeElement, `rv-${color}`, isAdd);
    }
  }

  writeValue(value: any) {
    this.checked = !!value;
  }

  registerOnChange(fn: (value: any) => void) {
    this._controlValueAccessorChangeFn = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  private _transitionCheckState(newState: TransitionCheckState) {
    let oldState = this._currentCheckState;
    let renderer = this._renderer;
    let elementRef = this._elementRef;

    if (oldState === newState) {
      return;
    }

    this._currentCheckState = newState;
  }

  private _emitChangeEvent() {
    let event = new RvCheckboxChange();
    event.source = this;
    event.checked = this.checked;

    this._controlValueAccessorChangeFn(this.checked);
    this.change.emit(event);
  }

  _onInputFocus() {
    this.hasFocus = true;
  }

  _onInputBlur() {
    this.hasFocus = false;
    this.onTouched();
  }

  toggle() {
    this.checked = !this.checked;
  }

  _onInteractionEvent(event: Event) {
    event.stopPropagation();

    if (!this.disabled) {
      this.toggle();
      this._emitChangeEvent();
    }
  }

  _onInputClick(event: Event) {
    event.stopPropagation();
  }
}

@NgModule({
  imports: [CommonModule],
  exports: [RvCheckbox],
  declarations: [RvCheckbox]
})
export class RvCheckboxModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModel: RvCheckboxModule,
      providers: []
    }
  }
}
