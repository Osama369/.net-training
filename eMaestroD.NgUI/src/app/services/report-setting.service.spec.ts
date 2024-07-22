import { TestBed } from '@angular/core/testing';

import { ReportSettingService } from './report-setting.service';

describe('ReportSettingService', () => {
  let service: ReportSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
