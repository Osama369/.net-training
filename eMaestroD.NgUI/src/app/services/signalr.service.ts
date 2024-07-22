import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { ToastrService } from 'ngx-toastr';
import { TenantService } from './tenant.service';
import { environment } from 'src/environments/environment';
import { NotificationMessage } from '../models/notification';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  constructor(private toastr: ToastrService,public tenantService: TenantService, public authService: AuthService) {}
  private hubConnection!: signalR.HubConnection;
  private notificationSubject: Subject<NotificationMessage[]> = new Subject<NotificationMessage[]>();

  public baseUrl = environment.BaseApiUrl+'/Notify';

    public startConnection = () => {
      this.hubConnection = new signalR.HubConnectionBuilder()
                              .withUrl(this.baseUrl,{ skipNegotiation: true,
                              transport: signalR.HttpTransportType.WebSockets})
                              .build();
      this.hubConnection
        .start()
        // .then(() => console.log('Connection started'))
        // .catch(err => console.log('Error while starting connection: ' + err))
    }

    public addMessageListner = () => {
      this.hubConnection.on('SendMessage', (notification: NotificationMessage[]) => {
        this.notificationSubject.next(notification);
        // this.showNotification(notification);
      });
    }

    ClearNotification()
    {
      this.notificationSubject.next([]);
      return this.notificationSubject.asObservable();
    }

    showNotification(notification: Notification) {
      // this.toastr.warning( notification.message);
    }

    getNotificationObservable() {
      return this.notificationSubject.asObservable();
    }

    unsubscribe(): void {
      if (this.hubConnection && this.hubConnection.state === 'Connected') {
        this.hubConnection.stop();
      }
    }

  }


