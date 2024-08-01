import { Component, OnInit, Input, ViewChild, SimpleChanges, Output, EventEmitter } from "@angular/core";
import { Table } from "primeng/table";
import { ReportSettingService } from "../../Services/report-setting.service";
import { ReportSettings } from "../../Models/report-settings";

@Component({
  selector: 'app-report-setting',
  templateUrl: './report-setting.component.html',
  styleUrls: ['./report-setting.component.css']
})

export class ReportSettingComponent {
  constructor(
    private reportSettingService:ReportSettingService
    ){}

  heading : any = "Report Setting";
  list:ReportSettings[]=[];
  @Output() dataEvent = new EventEmitter<any>();

  ngOnInit() {
    this.reportSettingService.getReportSettings().subscribe(rptlist=>{
      this.list = rptlist;
    });
  }

  save()
  {
    this.reportSettingService.saveReportSettings(this.list).subscribe({
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



