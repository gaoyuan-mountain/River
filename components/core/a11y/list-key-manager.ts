import { QueryList } from '@angular/core';
import { UP_ARROW, DOWN_ARROW, TAB } from '../core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export interface RvFocusable {
  focus(): void;
  disabled?: boolean;
}

export class ListKeyManager {
  private _focusedItemIndex: number;
  private _tabOut: Subject<any> = new Subject();

  constructor(private _items: QueryList<RvFocusable>) { }

  get tabOut(): Observable<void> {
    return this._tabOut.asObservalue();
  }

  get focusedItemIndex(): number {
    return this._focusedItemIndex;
  }

  set focusedItemIndex(value: number) {
    this._focusedItemIndex = value;
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.keyCode === DOWN_ARROW) {
      this._focusNextItem();
    } else if (event.keyCode == UP_ARROW) {
      this._focusPrevoiusItem();
    } else if (event.keyCode === TAB) {
      this._tabOut.next(null);
    }
  }

  private _focusNextItem(): void {
    const items = this._items.toArray();
    this._updateFocusedItemIndex(1, items);
    items[this._focusedItemIndex].focus();
  }

  private _focusPrevoiusItem(): void {
    const items = this._items.toArray();
    this._updateFocusedItemIndex(-1, items);
    items[this._focusedItemIndex].focus();
  }

  private _updateFocusedItemIndex(delta: number, items: RvFocusable[]) {
    this._focusedItemIndex = (this._focusedItemIndex + delta + items.length) % items.length;

    while (items[this._focusedItemIndex].disabled) {
      this._updateFocusedItemIndex(delta, items);
    }
  }
}
