import { OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { Router, RouterLink } from '@angular/router';
import { AutoComplete } from 'primeng/autocomplete';
import { ScreenService } from '../Administration/Services/screen.service';
import { APP_ROUTES } from '../app-routes';


@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})

export class AppMenuComponent implements OnInit {

    model: any[] = [];
    selectedItem: any="";

    searchText: string = '';
    filteredItems: any[]=[];
    isPos: boolean = localStorage.getItem("isPos") === 'true';
    isShowPurchase:any;
    @ViewChild('autoComplete') autoComplete!: AutoComplete | undefined;

    constructor(public layoutService: LayoutService,
      public ScreenService: ScreenService,
      private router: Router,
    
    ) {
     }

     filterItems(event: any) {
      const allItems = this.model.flatMap(parent => {
        const childItems = parent.items.flatMap((item: any) => item.items ? item.items.map((child: any) => ({  child: child.label, routerLink: child.routerLink })) : []);
        return [...childItems]; // Include parent label as well
      });
      allItems.unshift({ parent: "Dashboard", child: "Dashboard", routerLink: [APP_ROUTES.dashboard] });
      this.filteredItems = allItems.filter(item => item.child.toLowerCase().includes(this.selectedItem.toLowerCase()));
    }


    onAutocompleteSelect(event: any) {
      const routeToNavigate = this.selectedItem.routerLink; // Assuming the selected item has a routerLink property
      this.selectedItem = "";
      if (this.autoComplete?.inputEL?.nativeElement) {
        this.autoComplete.inputEL.nativeElement.value  = '';
      }
      if (routeToNavigate) {
        this.router.navigate(routeToNavigate);
      }
    }

    ngOnInit() {
      

      this.model = [
        {
          label: '',
          items: [
            // {
            //   label: 'Dashboard',
            //   icon: 'pi pi-fw pi-home',
            //   routerLink: [APP_ROUTES.dashboard],
            // },
            // {
            //   label: 'Manage',
            //   icon: 'pi pi-fw pi-pencil',
            //   items: [
                
            //     { label: 'Suppliers', routerLink: [APP_ROUTES.manage.suppliers] },
            //     { label: 'Stores', routerLink: [APP_ROUTES.manage.suppliers] },
               
            //   ],
            // }
            {
              label: 'Administration',
              icon: 'pi pi-fw pi-cog',
              items: [
                
                { label: 'Users', routerLink: [APP_ROUTES.administration.users] },
                { label: 'Authorization', routerLink: [APP_ROUTES.administration.authorization] },
                { label: 'Company Setting', routerLink: [APP_ROUTES.administration.companySetting] },
                // {label:'Suppliers',}
              ],
            },
            {
              label:'Manage',
              icon:'pi pi-fw pi-cog',
              items:[
                { label: 'Suppliers', routerLink: [APP_ROUTES.manage.suppliers] },
                { label:'Products',routerLink:APP_ROUTES.manage.products},
                { label:'Files',routerLink:APP_ROUTES.manage.Files },
                // { label:'Invoice',routerLink:APP_ROUTES.manage.Invoice }
              ]
            },
          
          ],
        },
      ];
   
    }

    getDynamicLabel(condition: boolean, trueLabel: string, falseLabel: string): string {
      return condition ? trueLabel : falseLabel;
    }
}
