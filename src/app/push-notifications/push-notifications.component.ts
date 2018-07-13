
import
  { Component
  , OnInit
  }
  from '@angular/core';

import { PushNotificationsService } from '../push-notifications.service';

import { Observable } from 'rxjs';

import { SwPush } from '@angular/service-worker';


@Component({
  selector    : 'app-push-notifications',
  templateUrl : './push-notifications.component.html',
  styleUrls   : ['./push-notifications.component.scss']
})
export class PushNotificationsComponent implements OnInit {

  constructor (
      private notification_service : PushNotificationsService
    , private push_service : SwPush
    ) {
      this.notification_service.requestPermission ();
  }

  ngOnInit () {
    this.notifications.push(
        { title        : 'To Do Task'
        , alertContent : 'Fifth Alert'
        }
      );

      this.notifications.push(
        { title        : 'Approval'
        , alertContent : 'Fourth Alert'
        }
      );

      this.notifications.push(
        { title        : 'Leave Application'
        , alertContent : 'Third Alert'
        }
      );

      this.notifications.push(
        { title        : 'Request'
        , alertContent : 'Second Alert'
        }
      );

      this.notifications.push(
        { title        : 'Approval'
        , alertContent : 'First Alert'
        }
      );
  }

  private VAPID_PUBLIC_KEY : string =
    'BMFsCTrpa_8_PoS-iB0JsNUQIfwHWm3l5vB4TT74rpJIFvsFmW0rBcgXuasFWLr5cnRMv93Xuk_UQyBnONAg4JE' ;

  private notifications : Array <any> = [] ;


  public notify () :void {
    let cur_notification = this.notifications.pop () ;

    this.notifications = [cur_notification].concat (this.notifications) ;

    this.notification_service.generateNotification (cur_notification) ;
  }



  public subscribeToPush () : void {

    this.push_service.requestSubscription ({ serverPublicKey : this.VAPID_PUBLIC_KEY })
      . then (
          (subscription) => {
            this.notification_service.addSubscriber (subscription);
          }
        )
      . catch (
        (cur_error) => {
          console.error (cur_error);
        }
      )
  }


  public unsubscribeToPush () {
    
  }
}

