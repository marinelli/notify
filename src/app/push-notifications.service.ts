
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

import
  { NotificationPermission
  , NotificationOptions
  }
  from './notification';



const notificationsAreSupported : () => boolean =
    () => 'Notification' in window ;



@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {

  constructor (private http : HttpClient) {
    this.permission =
      /*  if  */ notificationsAreSupported ()
        /* then */ ? 'default'
        /* else */ : 'denied'
      ;
  }


  public permission : NotificationPermission;


  public urlBase64ToUint8Array (base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }


  public addSubscriber (cur_subscription) {

    const url = 'http://localhost:12345/webpush';
    console.log('[Push Service] Adding subscriber')

    let body = {
      action: 'subscribe',
      subscription: cur_subscription
    }

    console.log (JSON.stringify (cur_subscription));

    return ;
  }


  public deleteSubscriber (cur_subscription) {

    const url = 'http://localhost:12345/webpush';
    console.log('[Push Service] Deleting subscriber')

    let body = {
      action: 'unsubscribe',
      subscription: cur_subscription
    }

    console.log (JSON.stringify (cur_subscription));

    return ;
  }


  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      errMsg = `${error.statusText || 'Network error'}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }



  public requestPermission () : void {
    if (notificationsAreSupported ()) {
      Notification.requestPermission (
          (status) => {
            return this.permission = status;
          }
        );
    }
  }


  public create (title : string, options ? : NotificationOptions) : Observable<{}> {
    let _self = this;

    return new Observable (
        (subscriber) => {
          if (!notificationsAreSupported) {
            // Notifications are not available
            subscriber.complete ();
          }

          if (_self.permission !== 'granted') {
            // The user hasn't granted you permission
            // to send push notifications
            subscriber.complete ();
          }

          let _notify : Notification =
            new Notification (title, options);

          _notify.onshow =
            (cur_event) => {
              return subscriber.next (
                  { notification : _notify
                  , event        : cur_event
                  }
                );
            };

          _notify.onclick =
            (cur_event) => {
              return subscriber.next (
                  { notification : _notify
                  , event        : cur_event
                  }
                );
            };

          _notify.onerror =
            (cur_event) => {
              return subscriber.error (
                  { notification: _notify
                  , event: cur_event
                  }
                );
            };

          _notify.onclose =
            () => {
              return subscriber.complete();
            };
        }
      );
  }


  public generateNotification (notification_item) : Subscription {
    let _self = this;

    let options : NotificationOptions =
      { body : notification_item.alertContent
      , icon : 'assets/icons/bell.png'
      , requireInteraction : false
      };

    return _self.create (notification_item.title, options) . subscribe ();
  }

}

