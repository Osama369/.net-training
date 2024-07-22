import { Component, OnInit, Input, ViewChild, SimpleChanges, Output, EventEmitter } from "@angular/core";
import { Table } from "primeng/table";
import { ReportSettings } from "src/app/models/report-settings";
import { ReportSettingService } from 'src/app/services/report-setting.service';

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



