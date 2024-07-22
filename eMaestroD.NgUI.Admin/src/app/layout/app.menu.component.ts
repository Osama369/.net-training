import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})

export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: '',
                items: [
                    // { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/Dashboard'] },
                    { label: 'Tenants', icon: 'pi pi-fw pi-users', routerLink: ['/tenants'] },
                    { label: 'Reminder Email', icon: 'pi pi-fw pi-send', routerLink: ['/reminderEmail'] },
                    { label: 'Authorization Template', icon: 'pi pi-fw pi-user', routerLink: ['/AuthorizationTemplate'] }
                ]
            }
        ];
    }
}
