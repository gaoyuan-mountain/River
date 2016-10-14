import {
  NgModule,
  ModuleWithProviders,
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  Input,
  Optional,
  Output,
  QueryList,
  ChangeDetectionStrategy,
  EventEmitter,
  Renderer,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dir, RvError } from '../core';

export class RvDuplicatedSidenavError extends RvError {
  constructor(align: string) {
    super(`A sidenav was already declared for 'align="${align}"'`);
  }
}

/**
 * <rv-sidenav> component.
 *
 * This component corresponds to the drawer of the sidenav.
 *
 * Please refer to README.md for examples on how to use it.
 */
@Component({
  selector: 'rv-sidenav, [rv-sidenav]',
  template: '<ng-content></ng-content>',
  host: {
    '(transitionend)': '_onTransitionEnd($event)',
    // must prevent the browser from aligning text based on value
    '[attr.align]': 'null'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class RvSidenav {
  /** Alignment of the sidenav (direction neutral); whether 'start' or 'end'. */
  @Input() align: 'start' | 'end' = 'start';

  /** Mode of the sidenav; whether 'over' or 'side'. */
  @Input() mode: 'over' | 'push' | 'side' = 'over';

  /** Weather the sidenav is opened */
  _opened: boolean = false;

  /** Event emitted when the sidenav is being opened. Use this to synchronize animations. */
  @Output('open-start') onOpenStart = new EventEmitter<void>();

  /** Event emitted when the sidenav is fully opened. */
  @Output('open') onOpen = new EventEmitter<void>();

  /** Event emitted when the sidenav is being closed. Use this to synchronize animations. */
  @Output('close-start') onCloseStart = new EventEmitter<void>();

  /** Event emitted when the sidenav is fully closed. */
  @Output('close') onClose = new EventEmitter<void>();

  /**
   * @param _elementRef The DOM element reference. Used for transition and width calculation.
   *     If not available we do not hook on transitions.
   */
  constructor(private _elementRef: ElementRef) {}

  /**
   * Wheather the sidenav is opened. We overload this beacuse we trigger an event when it
   * starts or end
   */
  @Input()
  get opened(): boolean {
    return this._opened;
  }
  set opened(v: boolean) {
    let booleanValue = v != null && `${v}` !== 'false';
    this.toggle(booleanValue);
  }

  /**
   * Open the sidenav, and return a Promise that will resolve when it's fully opened ( or get
   * rejected if it didn't).
   */
  open(): Promise<void> {
    return this.toggle(true);
  }

  /**
   * Close the sidenav, and return a Promise that will resolve when it's fully opened ( or get
   * rejected if it didn't).
   */
  close(): Promise<void> {
    return this.toggle(false);
  }

  /**
   * Toggle the sidenav. This is equivalent to calling open() when it's already opened, or
   * close() when it's closed.
   */
  toggle(isOpen: boolean = !this.opened): Promise<void> {
    if (isOpen === this.opened) {
      if (!this._transition) {
        return Promise.resolve(null);
      } else {
        return isOpen ? this._openPromise : this._closePromise;
      }
    }

    this._opened = isOpen;
    this._transition = true;

    if (isOpen) {
      this.onOpenStart.emit(null);
    } else {
      this.onCloseStart.emit(null);
    }

    if (isOpen) {
      if (this._openPromise == null) {
        this._openPromise = new Promise<void>((resolve, reject) => {
          this._openPromiseResolve = resolve;
          this._openPromiseReject = reject;
        });
      }

      return this._openPromise;
    } else {
      if (this._closePromise == null) {
        this._closePromise = new Promise<void>((resolve, reject) => {
          this._closePromiseResolve = resolve;
          this._closePromiseReject = reject;
        })
      }
      return this._closePromise;
    }
  }

  /**
   * When transition has finished, set the internal state for class and emit the proper event.
   */
  _onTransitionEnd(transitionEvent: TransitionEvent) {
    if (transitionEvent.target == this._elementRef.nativeElement
        && transitionEvent.propertyName.endsWith('transform')) {
      this._transition = false;
      if (this._opened) {
        if (this._openPromise != null) {
          this._openPromiseResolve();
        }

        if (this._closePromise != null) {
          this._closePromiseReject();
        }

        this.onOpen.emit(null);
      } else {
        if (this._closePromise != null) {
          this._closePromiseResolve()
        }

        if (this._openPromise != null) {
          this._openPromiseReject();
        }

        this.onClose.emit(null);
      }

      this._openPromise = null;
      this._closePromise = null;
    }
  }

  @HostBinding('class.rv-sidenav-closing') get _isClosing() {
    return !this._opened && this._transition;
  }
  @HostBinding('class.rv-sidenav-opening') get _isOpening() {
    return this._opened && this._transition;
  }
  @HostBinding('class.rv-sidenav-closed') get _isClosed() {
    return !this._opened && !this._transition;
  }
  @HostBinding('class.rv-sidenav-opened') get _isOpened() {
    return this._opened && !this._transition;
  }
  @HostBinding('class.rv-sidenav-end') get _isEnd() {
    return this.align == 'end';
  }
  @HostBinding('class.rv-sidenav-side') get _modeSide() {
    return this.mode == 'side';
  }
  @HostBinding('class.rv-sidenav-over') get _modeOver() {
    return this.mode == 'over';
  }
  @HostBinding('class.rv-sidenav-push') get _modePush() {
    return this.mode == 'push';
  }

  get _width() {
    if (this._elementRef.nativeElement) {
      return this._elementRef.nativeElement.offsetWidth;
    }

    return 0;
  }

  private _transition: boolean = false;
  private _openPromise: Promise<void>;
  private _openPromiseResolve: () => void;
  private _openPromiseReject: () => void;
  private _closePromise: Promise<void>;
  private _closePromiseResolve: () => void;
  private _closePromiseReject: () => void;
}

/**
 * <rv-sidenav-layout> component
 */
@Component({
  selector: 'rv-sidenav-layout, [rv-sidenav-layout]',
  templateUrl: './sidenav.html',
  styles: [
    require('./sidenav.scss'),
    require('./sidenav-transitions.scss')
  ],
  encapsulation: ViewEncapsulation.None
})
export class RvSidenavLayout implements AfterContentInit {
  @ContentChildren(RvSidenav) _sidenavs: QueryList<RvSidenav>;

  get start() {
    return this._start;
  }

  get end() {
    return this._end;
  }

  /** The sidenav at the start/end alignment, independent of direction. */
  private _start: RvSidenav;
  private _end: RvSidenav;


  /**
   * The position of sidenav, left or right
   * In LTR, _left == _start and _right == _end.
   * In RTL, _left == _end and _right == _start.
   */
  private _left: RvSidenav;
  private _right: RvSidenav;

  constructor(@Optional() private _dir: Dir, private _element: ElementRef, private _renderer: Renderer) {
    if (_dir != null) {
      _dir.dirChange.subscribe(() => this._validateDrawers());
    }
  }

  ngAfterContentInit() {
    this._sidenavs.changes.subscribe(() => this._validateDrawers());
    this._sidenavs.forEach((sidenav: RvSidenav) => this._watchSidenavToggle(sidenav));
    this._validateDrawers();
  }

  /**
   * Subscribes to sidenav events in order to set a class on the main layout element
   * when the sidenav is open and the backdrop is visibile. This ensures any overflow on the
   * layout element is properly hidden
   */
  private _watchSidenavToggle(sidenav: RvSidenav): void {
    if (!sidenav || sidenav.mode === 'side') {
      return ;
    }

    sidenav.onOpen.subscribe(() => this._setLayoutClass(sidenav, true));
    sidenav.onClose.subscribe(() => this._setLayoutClass(sidenav, false));
  }

  /** Toggles the "rv-sidenav-opened" class on the main "rv-sidenav-layout" element. */
  private _setLayoutClass(sidenav: RvSidenav, bool: boolean): void {
    this._renderer.setElementClass(this._element.nativeElement, 'rv-sidenav-opened', bool);
  }

  /** validate the state of the sidenav children compoents. */
  private _validateDrawers() {
    this._start = this._end = null;

    // Ensure that we have at most one start one end sidenav
    this._sidenavs.forEach(sidenav => {
      if (sidenav.align == 'end') {
        if (this._end != null) {
          throw new RvDuplicatedSidenavError('end');
        }

        this._end = sidenav;
      } else {
        if (this._start != null) {
          throw new RvDuplicatedSidenavError('start');
        }

        this._start = sidenav;
      }
    });

    this._right = this._left = null;

    // Detect if we're LTR or RTL
    if (this._dir == null || this._dir.value != 'ltr') {
      this._left = this._start;
      this._right = this._end;
    } else {
      this._left = this._end;
      this._right = this._start;
    }
  }

  _closeModalSidenav() {
    if (this._start != null && this._start.mode != 'side') {
      this._start.close();
    }

    if (this._end != null && this._end.mode != 'side') {
      this._end.close();
    }
  }

  _isShowingBackdrop(): boolean {
    return (this._isSidenavOpen(this._start) && this._start.mode != 'side')
        || (this._isSidenavOpen(this._end) && this._end.mode != 'side');
  }

  private _isSidenavOpen(side: RvSidenav): boolean {
    return side != null && side.opened;
  }

  /**
   * Return the width of the sidenav, if it's in the proper mode and opened.
   * This may relayout the view, so do not call this often.
   * @param sidenav
   * @param mode
   */
  private _getSidenavEffectiveWidth(sidenav: RvSidenav, mode: string): number {
   return (this._isSidenavOpen(sidenav) && sidenav.mode == mode) ? sidenav._width : 0;
  }

  _getMarginLeft() {
   return this._getSidenavEffectiveWidth(this._left, 'side');
  }

  _getMarginRight() {
   return this._getSidenavEffectiveWidth(this._right, 'side');
  }

  _getPositionLeft() {
   return this._getSidenavEffectiveWidth(this._left, 'push');
  }

  _getPositionRight() {
   return this._getSidenavEffectiveWidth(this._right, 'push');
  }

  /**
   * Returns the horizontal offset for the content area.  There should never be a value for both
   * left and right, so by subtracting the right value from the left value, we should always get
   * the appropriate offset.
   */
  _getPositionOffset() {
    return this._getPositionLeft() - this._getPositionRight();
  }

  /**
   * This is using [ngStyle] rather than separate [style...] properties because [style.transform]
   * doesn't seem to work right now.
   */
  _getStyles() {
    return {
      marginLeft: `${this._getMarginLeft()}px`,
      marginRight: `${this._getMarginRight()}px`,
      transform: `translate3d(${this._getPositionOffset}px, 0, 0)`
    };
  }
}

@NgModule({
  imports: [ CommonModule ],
  exports: [ RvSidenavLayout, RvSidenav ],
  declarations: [ RvSidenavLayout, RvSidenav ]
})
export class RvSidenavModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RvSidenavModule,
      providers: []
    };
  }
}
