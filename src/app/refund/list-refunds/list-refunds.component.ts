import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-list-refunds',
  templateUrl: './list-refunds.component.html',
  styleUrls: ['./list-refunds.component.scss']
})
export class ListRefundsComponent implements OnInit, AfterViewInit, OnDestroy {
  status: any;
  allRefunds: any;
  allRefundsData: any[];
  pageSize = 20;
  // tslint:disable-next-line: variable-name
  search_text = '';
  pageSize$ = new Subject<number>();
  searchText$ = new Subject<string>();
  pageTitle: string;
  refundsSubscription: Subscription;
  routeId: any;
  constructor(private service: ProjectService, private activatedRoute: ActivatedRoute, private notification: NzNotificationService, private title: Title) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param: Params) => {
      this.status = param.id;
      this.routeId = param.id;
      this.resetPageParams();
      if (this.status == '1') {
        this.getPageTitle(-param.id);
      } else {
        this.getPageTitle(param.id);
      }
      this.fetchRefunds();
    });
  }

  ngOnDestroy() {
    this.refundsSubscription.unsubscribe();
  }
  resetPageParams() {
    this.allRefunds = null;
    this.allRefundsData = null;
    this.search_text = '';
    this.pageSize = 20;
  }

  ngAfterViewInit() {
    this.searchRefunds();
    this.fetchPageSize();
  }

  getPageTitle(status) {
    switch (status) {
      case '0':
        this.pageTitle = 'Refunds Awaiting Initial Approval';
        break;
      case '1':
        this.pageTitle = 'Refunds Awaiting Final Approval';
        break;
      case '2':
        this.pageTitle = 'Completed Refunds';
        break;
        case '3':
          this.pageTitle = 'Rejected Refunds';
          break;
          case '4':
            this.pageTitle = 'Canceled Refunds';
            break;
      default:
        this.pageTitle = 'Refunds';
    }
    this.title.setTitle(`Refunds | ${this.pageTitle}`);
  }

  

  fetchRefunds() {
    const params = {
      status: this.status,
      page_size: this.pageSize,
      search_text: this.search_text
    };
    this.refundsSubscription = this.service.listRefunds(params).subscribe((data: any) => {
      if (data.status === 'success') {
        this.allRefunds = data.refund;
        this.allRefundsData = data.refund.data;
      }
    });
  }
  changeSearch(search) {
    this.searchText$.next(search);
  }

  changePage(pagenumber) {
    this.pageSize$.next(pagenumber);
  }

  goNext() {
    if (!this.allRefunds.next_page_url) {
      // this.toastr.info('You are on the last page already');
      this.notification.info('Hey!', 'You are on the last page already');
    } else {
      const json = {
        status: this.status,
        search_text: this.search_text,
        page_size: this.pageSize
      };
      this.service.fetchMoreRecords(this.allRefunds.next_page_url, json).subscribe((data: any) => {
        if (data.status === 'success') {
          this.allRefunds = data.refund;
          this.allRefundsData = data.refund.data;
        }
      });
    }
  }

  goPrevious() {
    if (!this.allRefunds.prev_page_url) {
      this.notification.info('Hey!', 'You are on the first page already');
    } else {
      const json = {
        status: this.status,
        search_text: this.search_text,
        page_size: this.pageSize
      };
      this.service.fetchMoreRecords(this.allRefunds.prev_page_url, json).subscribe((data: any) => {
        if (data.status === 'success') {
          this.allRefunds = data.refund;
          this.allRefundsData = data.refund.data;
        }
      });
    }
  }

  searchRefunds() {
    this.searchText$.pipe(debounceTime(500), distinctUntilChanged(), switchMap(m => {
      this.search_text = m;
      const pageDetails = {
        status: this.status,
        page_size: this.pageSize,
        search_text: m
      };
      return this.service.listRefunds(pageDetails);
    })).subscribe((data: any) => {
      if (data.status === 'success') {
        this.allRefunds = data.refund;
        this.allRefundsData = data.refund.data;
      }
    });
  }

  fetchPageSize() {
    this.pageSize$.pipe(debounceTime(500), distinctUntilChanged(), switchMap(m => {
      this.pageSize = m;
      const pageDetails = {
        status: this.status,
        page_size: m,
        search_text: this.search_text
      };
      return this.service.listRefunds(pageDetails);
    })).subscribe((data: any) => {
      if (data.status === 'success') {
        this.allRefunds = data.refund;
        this.allRefundsData = data.refund.data;
      }
    });
  }

  changeIndex(tab: NzTabChangeEvent) {
    const originalStatus = this.routeId;
    console.log(tab)
    if (tab.index === 1) {
      this.status = '1';
    } else {
      this.status = '-1';
    }
    this.pageSize = 20;
    this.allRefunds = null;
    this.allRefundsData = null;
    this.search_text = '';
    this.fetchRefunds();
  }
}
