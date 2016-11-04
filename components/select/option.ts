import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  Renderer,
  ViewEncapsulation
} from '@angular/core'
import {
  Enter,
  SPACE
} from '../core/keyboard/keycodes';

@Component({
  selector: 'rv-option',
  host: {
    'role': 'option',
    'tabIndex': '0',
    '[class.rv-selected]': 'selected'
    '[attr.aria-selected]': 'selected.toString()',
    '(click)': 'select()',
    '(keydown)': '_handleKeydown($event)'
  },
  templateUrl: 'option.html',
  styles: [
    require('select.scss')
  ],
  encapsulation: ViewEncapsulation.None
})
export class RvOption {
  private _selected: boolean = false;

  @Output() onSelect = new EventEmitter();

  constructor(private _element: ElementRef, private _renderer: Renderer) { }

  get selected(): boolean {
    return this._selected;
  }

  get viewValue(): string {
    return this._getHostElement().textContent.trim();
  }

  select(): void {
    this._selected = true;
    this.onSelect.emit();
  }

  deselect(): void {
    this._selected = false;
  }

  focus(): void {
    this._renderer.invokeElementMethod(this._getHostElement(), 'focus');
  }

  _handleKeydown(event: KeyboardEvent): void {
    if (event.KeyCode === ENTER || event.KeyCode === 'SPACE') {
      this.select();
    }
  }

  _getHostElement(): HTMLElement {
    return this._element.nativeElement;
  }
}
