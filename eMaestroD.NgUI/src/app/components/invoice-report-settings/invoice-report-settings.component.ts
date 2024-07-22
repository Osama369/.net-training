import { Subscription, filter } from 'rxjs';
import { Component, OnInit, Input, ViewChild, SimpleChanges, Output, EventEmitter } from "@angular/core";
import { Table } from "primeng/table";
import { ReportSettings } from "src/app/models/report-settings";
import { ReportSettingService } from 'src/app/services/report-setting.service';

@Component({
  selector: 'app-invoice-report-settings',
  templateUrl: './invoice-report-settings.component.html',
  styleUrls: ['./invoice-report-settings.component.scss']
})

export class InvoiceReportSettingsComponent {
  constructor(
    private reportSettingService:ReportSettingService
    ){}

  list:any[]=[];
  @Input() screenName:any;
  heading : any;
  @Output() dataEvent = new EventEmitter<any>();
  private subscription: Subscription;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['screenName']) {
      this.heading = this.screenName + " Report Print Setting";
      if (this.subscription) {
        this.subscription.unsubscribe(); // Unsubscribe from previous subscription
      }
      this.subscription = this.reportSettingService.GetInvoiceReportSettings()
        .subscribe(rptlist => {
          this.list = rptlist.filter(x => x.screenName.trim().toLowerCase() === this.screenName.trim().toLowerCase());
        });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Unsubscribe to prevent memory leaks
    }
  }

  OnRadioChange(selectedData: any) {
    this.list.forEach(data => {
      if (data !== selectedData && data.type === 'radioButton' && data != selectedData) {
        data.value = false; // Deselect all other radio buttons
      }
      else if(data == selectedData) {
        data.value = true;
      }
    });
  }

  OnRadioChange1(selectedData: any) {
    this.list.forEach(data => {
      if (data !== selectedData && data.type === 'radioButton1' && data != selectedData) {
        data.value = false; // Deselect all other radio buttons
      }
      else if(data == selectedData) {
        data.value = true;
      }
    });
  }

  save()
  {
    this.reportSettingService.SaveInvoiceReportSettings(this.list).subscribe({
      next: (rpt) => {
        this.dataEvent.emit(this.list);
      }
    });
  }

  close()
  {
    this.dataEvent.emit(false);
  }

}



