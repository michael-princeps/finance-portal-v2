import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from 'src/app/core/services/project.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-ippis-expected',
  templateUrl: './ippis-expected.component.html',
  styleUrls: ['./ippis-expected.component.scss']
})
export class IppisExpectedComponent implements OnInit {
  searchtext = '';
  pageSize = 20;
  pageSize$ = new Subject<number>();
  searchdate: Date;
  totalcount: number;
  totalsum: number;
  paymentsToUpload: any[];
  allPayments: any;
  allPaymentsData: any[];
  defaultYear: number = new Date(Date.now()).getFullYear();
  selectedMonth: any = new Date(Date.now()).getMonth();
  pageType = 'received';
  
  constructor(private notification: NzNotificationService, private service: ProjectService, private title: Title) {
    this.title.setTitle('IPPIS | Expected Payment');
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
        type: this.pageType,
        date: this.searchdate,
        searchtext: this.searchtext
      };
      this.service.fetchMoreRecords(this.allPayments.next_page_url, json).subscribe((data: any) => {
        if (data.status === 'success') {
          this.allPayments = data.loans;
          this.allPaymentsData = data.loans.data;
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
        type: this.pageType,
        date: this.searchdate,
        searchtext: this.searchtext
      };
      this.service.fetchMoreRecords(this.allPayments.prev_page_url, json).subscribe((data: any) => {
        if (data.status === 'success') {
          this.allPayments = data.loans;
          this.allPaymentsData = data.loans.data;
        }
      });
    }
  }
}
