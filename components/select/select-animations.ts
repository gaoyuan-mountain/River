import {
  animate,
  AnimationEntryMetadata,
  state,
  style,
  transition,
  trigger
} from '@angular/core';

export const transformPlaceholder: AnimationEntryMetadata = trigger('transformPlaceholder', [
  state('normal', style({
    transform: `translate3d(0, 0, 0) scale(1)`
  })),
  state('floating-ltr', style({
    transform: `translate3d(-2px, -22px, 0) scale(0.75)`
  })),
  transition('* => *', animate(`400ms cubic-bezier(0.25, 0.8, 0.25, 1)`))
]);

export const transformPanel: AnimationEntryMetadata = trigger('transformPaned', [
  state('showing-ltr', style({
    opacity: 1,
    width: 'calc(100% + 32px)',
    transform: `translate3d(16px, -9px, 0) scaleY(1)`
  })),
  transition('void => *', [
    style({
      opacity: 0,
      width: '100%',
      transform: `translate3d(0, 0, 0) scaleY(0)`
    }),
    animate(`150ms cubic-bezier(0.25, 0.8, 0.25, 1)`)
  ]),
  transition('* => void', [
    animate('250ms 100ms linear', style({opacity: 0}))
  ])
]);

export const fadeInContent: AnimationEntryMetadata = trigger('fadeInContent', [
  state('showing', style({opacity: 1})),
  transition('void => showing', [
    style({opacity: 0}),
    animate(`150ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)`)
  ])
]);
