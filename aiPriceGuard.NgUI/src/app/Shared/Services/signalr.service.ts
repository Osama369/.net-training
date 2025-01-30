import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { TenantService } from 'src/app/Administration/Services/tenant.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  constructor(private toastr: ToastrService,public tenantService: TenantService, public authService: AuthService) {}
  private hubConnection!: signalR.HubConnection;
 
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

   

    

    showNotification(notification: Notification) {
      // this.toastr.warning( notification.message);
    }

    
    unsubscribe(): void {
      if (this.hubConnection && this.hubConnection.state === 'Connected') {
        this.hubConnection.stop();
      }
    }

  }


