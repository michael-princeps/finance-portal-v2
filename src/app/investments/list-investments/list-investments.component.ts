import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-list-investments',
  templateUrl: './list-investments.component.html',
  styleUrls: ['./list-investments.component.scss']
})
export class ListInvestmentsComponent implements OnInit, AfterViewInit {
  // tslint:disable-next-line: variable-name
  search_text = '';
  pageSize = 50;
  investmentObject: any;
  private searchText$ = new Subject<string>();
  private pageSize$ = new Subject<number>();
  investments: any;
  investmentsData: any[];
  status: any;
  pageTitle: string;
  investmentSubscription: any;
  constructor(private service: ProjectService, private activatedRoute: ActivatedRoute,  private notification: NzNotificationService, private title: Title) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param: Params) => {
      this.status = param.id;
      this.resetPageParams();
      this.getPageTitle(param.id);
      this.fetchInvestments();
    });
  }

  ngAfterViewInit() {
    this.searchInvestments();
    this.fetchPageSize();
  }

  resetPageParams() {
    this.investmentObject = null;
    this.investments = null;
    this.investmentsData = null;
    this.search_text = '';
    this.pageSize = 20;
  }

  getPageTitle(status) {
    switch (status) {
      case '0':
        this.pageTitle = 'New Investments';
        break;
      case '1':
        this.pageTitle = 'Processing Investments';
        break;
      case '2':
        this.pageTitle = 'Completed Investments';
        break;
        case '3':
        this.pageTitle = 'Cancelled Investments';
        break;
      default:
        this.pageTitle = 'Investments';
    }
    this.title.setTitle(`Investments | ${this.pageTitle}`);
  }

  fetchInvestments() {
    const params = {
      status: this.status,
      page_size: this.pageSize,
      search_text: this.search_text
    };
    this.investmentSubscription = this.service.listInvestments(params).subscribe((data: any) => {
      if (data.status === 'success') {
        this.investmentObject = data;
        this.investments = data.investment;
        this.investmentsData = data.investment.data;
      }
    });
  }

  searchInvestments() {
    this.searchText$.pipe(debounceTime(500), distinctUntilChanged(), switchMap(m => {
      this.search_text = m;
      const pageDetails = {
        status: this.status,
        page_size: this.pageSize,
        search_text: m
      };
      return this.service.listInvestments(pageDetails);
    })).subscribe((data: any) => {
      if (data.status === 'success') {
        this.investmentObject = data;
        this.investments = data.investment;
        this.investmentsData = data.investment.data;
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
      return this.service.listInvestments(pageDetails);
    })).subscribe((data: any) => {
      if (data.status === 'success') {
        this.investmentObject = data;
        this.investments = data.investment;
        this.investmentsData = data.investment.data;
      }
    });
  }

  changeSearch(search: string) {
    this.searchText$.next(search);
  }

  changePage(num: number) {
    this.pageSize$.next(num);
  }

  goNext() {
    if (!this.investments.next_page_url) {
      // this.toastr.info('You are on the last page already');
      this.notification.info('Hey!', 'You are on the last page already');
    } else {
      const json = {
        status: this.status,
        search_text: this.search_text,
        page_size: this.pageSize
      };
      this.service.fetchMoreRecords(this.investments.next_page_url, json).subscribe((data: any) => {
        if (data.status === 'success') {
          this.investmentObject = data;
          this.investments = data.investment;
          this.investmentsData = data.investment.data;
        }
      });
    }
  }

  goPrevious() {
    if (!this.investments.prev_page_url) {
      this.notification.info('Hey!', 'You are on the first page already');
    } else {
      const json = {
        status: this.status,
        search_text: this.search_text,
        page_size: this.pageSize
      };
      this.service.fetchMoreRecords(this.investments.prev_page_url, json).subscribe((data: any) => {
        if (data.status === 'success') {
          this.investmentObject = data;
          this.investments = data.investment;
          this.investmentsData = data.investment.data;
        }
      });
    }
  }
}
