import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnDestory,
  Optional,
  Output,
  QueryList,
  Renderer,
  ViewEncapsulation，
  ViewChild
} from '@angular/core';
import { RvOption } from './option';
import { ENTER, SPACE } from '../core/keyboard/keycodes';
import { ListKeyManager } from '../core/a11y/list-key-manager';
import { Subscription } from 'rxjs/Subscription';
import { transformPlaceholder, transformPanel, fadeInContent } from './select-animations';

@Component({
  selector: 'rv-select',
  templateUrl: 'select.html',
  styles: [
    require('select.scss')
  ],
  encapsulation: ViewEncapsulation.None,
  host: {
    'role': 'listbox',
    'tabindex': '0',
    '[attr.aria-label]': 'placeholder',
    '(keydown)': '_openOnActive($event)'
  },
  animations: [
    transformPlaceholder,
    transformPanel,
    fadeInContent
  ],
  exportAs: 'rvSelect'
})
export class RvSelect implements AfterContentInit, OnDestory {
  private _panelOpen: boolean = false;
  private _selected: RvOption;
  private _subscriptions: Subscription[] = [];
  private _tabSubscription: Subscription;

  _keyManager: ListKeyManager;

  _position = [{
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'top'
  }];

  @ViewChild('trigger') trigger: ElementRef;
  @ContentChildren(RvOption) options: QueryList<RvOption>;

  @Input() placeholder: string;
  @Output() onOpen = new EventEmitter();
  @Output() onClose = new EventEmitter();

  constructor(private _element: ElementRef, private _renderer: Renderer) { }

  ngAfterContentInit() {
    this._iniKeyManager();
    this._listenToOptions();

    this._changeSubscription = this.options.changes.subscribe(() => {
      this._dropSubscriptions();
      this._listenToOptions();
    })
  }

  ngOnDestory() {
    this._dropSubscriptions();
    this._changeSubscription.unsubscribe();
    this._tabSubscription.unsubscribe();
  }

  toggle(): void {
    this.panelOpen ? this.close() : this.open();
  }

  open(): void {
    this._panelOpen = true;
  }

  close(): void {
    this._panelOpen = false;
  }

  get panelOpen(): boolean {
    return this._panelOpen;
  }

  get selected(): RvOption {
    return this._selected;
  }

  _getWidth(): number {
    return this.trigger.nativeElement.getBoundingClientReact().width;
  }

  _getPlaceholderState(): string {
    if (this.panelOpen || this.selected) {
      return 'floatting-ltr';
    } else {
      return 'normal';
    }
  }

  _getPanelState(): string {
    return 'showing-ltr';
  }

  _openOnActive(event: KeyboardEvent): void {
    if (event.keyCode === ENTER || event.keyCode === SPACE) {
      this.open();
    }
  }

  _onPanelDone(): void {
    if (this.panelOpen) {
      this._focusCorrectOption();
      this.onOpen.emit();
    } else {
      this._focusHost();
      this.onClose.emit();
    }
  }

  private _iniKeyManager() {
    this._keyManager = new ListKeyManager(this.options);
    this._tabSubscription = this._keyManager.tabOut.subscribe(() => {
      this.close();
    })
  }

  private _listenToOptions(): void {
    this.options.forEach((option: RvOption) => {
      const sub = option.onSelect.subscribe(() => this._onSelect(option));
      this._subscriptions.push(sub);
    });
  }

  private _dropSubscriptions(): void {
    this._subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
    this._subscriptions = [];
  }

  private _onSelect(option: RVOption): void {
    this._selected = option;
    this._updateOptions();
    this.close();
  }

  private _updateOptions(): void {
    this.options.forEach((option: RvOption) => {
      if (option !== this.selected) {
        option.deselect();
      }
    })
  }

  private _focusCorrectOption(): void {
    if (this.selected) {
      this._keyManager.focusedItemIndex = this._getOptionIndex(this.selected);
      this.selected.focus();
    } else {
      this._keyManager.focusedItemIndex = 0;
      this.options.first.focus();
    }
  }

  private _focusHost(): void {
    this._renderer.invokeElementMethod(this._element.nativeElement, 'focus');
  }

  private _getOptionIndex(option: RvOption): number {
    return this.options.reduce((result: number, current: RvOption, index: number) => {
      return result === undefined ? (option === current ? index : undefined) : result;
    }, undefined)
  }
}
