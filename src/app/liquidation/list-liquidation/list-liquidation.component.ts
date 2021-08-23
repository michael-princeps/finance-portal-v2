import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-list-liquidation',
  templateUrl: './list-liquidation.component.html',
  styleUrls: ['./list-liquidation.component.scss']
})
export class ListLiquidationComponent implements OnInit, AfterViewInit, OnDestroy {
  status: any;
  allLiquidation: any;
  allLiquidationData: any[];
  pageSize = 20;
  // tslint:disable-next-line: variable-name
  search_text = '';
  pageSize$ = new Subject<number>();
  searchText$ = new Subject<string>();
  pageTitle: string;
  liquidationSubscription: Subscription;

  // tslint:disable-next-line: max-line-length
  constructor(private activatedRoute: ActivatedRoute, private service: ProjectService, private notification: NzNotificationService, private title: Title) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param: Params) => {
      this.status = param.id;
      this.resetPageParams();
      this.getPageTitle(param.id);
      this.fetchLiquidations();
    });
  }

  ngOnDestroy() {
    this.liquidationSubscription.unsubscribe();
  }
  resetPageParams() {
    this.allLiquidation = null;
    this.allLiquidationData = null;
    this.search_text = '';
    this.pageSize = 20;
  }

  ngAfterViewInit() {
    this.searchLiquidations();
    this.fetchPageSize();
  }

  getPageTitle(status) {
    switch (status) {
      case '0':
        this.pageTitle = 'New Liquidation';
        break;
      case '1':
        this.pageTitle = 'Completed Liquidation';
        break;
      case '2':
        this.pageTitle = 'Canceled Liquidation';
        break;
      default:
        this.pageTitle = 'Liquidation';
    }
    this.title.setTitle(`Liquidation | ${this.pageTitle}`);
  }


  fetchLiquidations() {
    const params = {
      status: this.status,
      page_size: this.pageSize,
      search_text: this.search_text
    };
    this.liquidationSubscription = this.service.listLiquidations(params).subscribe((data: any) => {
      if (data.status === 'success') {
        this.allLiquidation = data.liquidation;
        this.allLiquidationData = data.liquidation.data;
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
    if (!this.allLiquidation.next_page_url) {
      // this.toastr.info('You are on the last page already');
      this.notification.info('Hey!', 'You are on the last page already');
    } else {
      const json = {
        status: this.status,
        search_text: this.search_text,
        page_size: this.pageSize
      };
      this.service.fetchMoreRecords(this.allLiquidation.next_page_url, json).subscribe((data: any) => {
        if (data.status === 'success') {
          this.allLiquidation = data.liquidation;
          this.allLiquidationData = data.liquidation.data;
        }
      });
    }
  }

  goPrevious() {
    if (!this.allLiquidation.prev_page_url) {
      this.notification.info('Hey!', 'You are on the first page already');
    } else {
      const json = {
        status: this.status,
        search_text: this.search_text,
        page_size: this.pageSize
      };
      this.service.fetchMoreRecords(this.allLiquidation.prev_page_url, json).subscribe((data: any) => {
        if (data.status === 'success') {
          this.allLiquidation = data.liquidation;
          this.allLiquidationData = data.liquidation.data;
        }
      });
    }
  }

  searchLiquidations() {
    this.searchText$.pipe(debounceTime(500), distinctUntilChanged(), switchMap(m => {
      this.search_text = m;
      const pageDetails = {
        status: this.status,
        page_size: this.pageSize,
        search_text: m
      };
      return this.service.listLiquidations(pageDetails);
    })).subscribe((data: any) => {
      if (data.status === 'success') {
        this.allLiquidation = data.liquidation;
        this.allLiquidationData = data.liquidation.data;
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
      return this.service.listLiquidations(pageDetails);
    })).subscribe((data: any) => {
      if (data.status === 'success') {
        this.allLiquidation = data.liquidation;
        this.allLiquidationData = data.liquidation.data;
      }
    });
  }
}
