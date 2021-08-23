import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-refund-report',
  templateUrl: './refund-report.component.html',
  styleUrls: ['./refund-report.component.scss']
})
export class RefundReportComponent implements OnInit, AfterViewInit {
  fromDate: any;
  toDate: any;
  refundReport: any;
  refundReportData: any[];
  status: any;
  pageSize = 20;
  pageSize$ = new Subject<number>();

  constructor(private service: ProjectService, private notification: NzNotificationService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.fetchPageSize();
  }
  fetchReports() {
    if (!this.fromDate || !this.toDate || !this.status) {
      this.notification.info('Incomplete!', 'Please fill all inputs');
    } else {
      const json = {
        start_date: this.fromDate,
        end_date: this.toDate,
        status: this.status,
        page_size: this.pageSize
      };
      this.service.fetchRefundReports(json).subscribe((data: any) => {
        if (data.status === 'success') {
          this.refundReport = data.refund;
          this.refundReportData = data.refund.data;
        }
      });
    }
  }

  changePage(pageNumber) {
    this.pageSize$.next(pageNumber);
  }

  fetchPageSize() {
    this.pageSize$.pipe(debounceTime(500), distinctUntilChanged(), switchMap(m => {
      this.pageSize = m;
      const pageDetails = {
        start_date: this.fromDate,
        end_date: this.toDate,
        status: this.status,
        page_size: m
      };
      return this.service.fetchLiquidationReports(pageDetails);
    })).subscribe((data: any) => {
      if (data.status === 'success') {
        this.refundReport = data.refund;
          this.refundReportData = data.refund.data;
      }
    });
  }
  goNext() {
    if (!this.refundReport.next_page_url) {
      // this.toastr.info('You are on the last page already');
      this.notification.info('Hey!', 'You are on the last page already');
    } else {
      const json = {
        start_date: this.fromDate,
        end_date: this.toDate,
        status: this.status,
        page_size: this.pageSize
      };
      this.service.fetchMoreRecords(this.refundReport.next_page_url, json).subscribe((data: any) => {
        if (data.status === 'success') {
          this.refundReport = data.refund;
          this.refundReportData = data.refund.data;
        }
      });
    }
  }

  goPrevious() {
    if (!this.refundReport.prev_page_url) {
      this.notification.info('Hey!', 'You are on the first page already');
    } else {
      const json = {
        start_date: this.fromDate,
        end_date: this.toDate,
        status: this.status,
        page_size: this.pageSize
      };
      this.service.fetchMoreRecords(this.refundReport.prev_page_url, json).subscribe((data: any) => {
        if (data.status === 'success') {
          this.refundReport = data.refund;
          this.refundReportData = data.refund.data;
        }
      });
    }
  }

}
