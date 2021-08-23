import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from 'src/app/core/services/project.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-ippis-reconcilation-results',
  templateUrl: './ippis-reconcilation-results.component.html',
  styleUrls: ['./ippis-reconcilation-results.component.scss']
})
export class IppisReconcilationResultsComponent implements OnInit {
  searchtext = '';
  pageSize = 20;
  pageSize$ = new Subject<number>();
  searchdate: Date;
  totalcount: number;
  totalsum: number;
  paymentsToUpload: any[];
  allPayments: any;
  allPaymentsData: any[];

  lessDeductionPayments: any[];
  missedPayments: any[];
  exactDeductions: any[];
  nonexpectedPayments: any[];
  overDeductionPayments: any[];
  pageType = 'result';

  constructor(private notification: NzNotificationService, private service: ProjectService, private title: Title) {
    this.title.setTitle('IPPIS | reconciliation Results');
  }

  ngOnInit(): void {
  }


  changeIndex(tabItem: NzTabChangeEvent) {

  }

  getMonth() {

  }

  searchPayments() { }

  changePage(pagesize: number) {
    this.pageSize$.next(pagesize);
  }

  goNext() {
    if (!this.allPayments.next_page_url) {
      // this.toastr.info('You are on the last page already');
      this.notification.info('Hey!', 'You are on the last page already');
    } else {
      const json = {
        search_text: this.searchtext,
        page_size: this.pageSize,
        date: this.searchdate,
        searchtext: this.searchtext,
        type: this.pageType,
      };
      this.service.fetchMoreRecords(this.allPayments.next_page_url, json).subscribe((data: any) => {
        if (data.status === 'success') {
          this.allPayments = data.results;
          this.exactDeductions = data.results.exact_deductions;
          this.lessDeductionPayments = data.results.less_deductions;
          this.missedPayments = data.results.missed_payment;
          this.nonexpectedPayments = data.results.non_expected_payment;
          this.overDeductionPayments = data.results.over_deduction;
        }
      });
    }
  }

  goPrevious() {
    if (!this.allPayments.prev_page_url) {
      this.notification.info('Hey!', 'You are on the first page already');
    } else {
      const json = {
        search_text: this.searchtext,
        page_size: this.pageSize,
        date: this.searchdate,
        searchtext: this.searchtext
      };
      this.service.fetchMoreRecords(this.allPayments.prev_page_url, json).subscribe((data: any) => {
        if (data.status === 'success') {
          this.allPayments = data.results;
          this.exactDeductions = data.results.exact_deductions;
          this.lessDeductionPayments = data.results.less_deductions;
          this.missedPayments = data.results.missed_payment;
          this.nonexpectedPayments = data.results.non_expected_payment;
          this.overDeductionPayments = data.results.over_deduction;
        }
      });
    }
  }
}
