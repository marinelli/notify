

export declare type NotificationPermission =
    'default'
  | 'denied'
  | 'granted'
;


export declare type NotificationDirection =
    'auto'
  | 'ltr'
  | 'rtl'
;


export interface NotificationOptions {
  dir?                : NotificationDirection;
  lang?               : string;
  // badge
  body?               : string;
  tag?                : string;
  icon?               : string;
  // image
  data?               : any;
  vibrate?            : number[];
  renotify?           : boolean;
  requireInteraction? : boolean;
  // actions
  silent?             : boolean;
  sound?              : string;
  noscreen?           : boolean;
  sticky?             : boolean;
}

