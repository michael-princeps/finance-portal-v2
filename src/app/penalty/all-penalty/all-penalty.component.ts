import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from 'src/app/core/services/project.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';
import {  Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-all-penalty',
  templateUrl: './all-penalty.component.html',
  styleUrls: ['./all-penalty.component.scss']
})
export class AllPenaltyComponent implements OnInit, AfterViewInit {
  allChecked = false;
  indeterminate = false;
  penaltyStatus: any;
  setOfCheckedId = new Set<number>();
  bulkSelectedAction = null;
  isPerformingBulkAction: boolean;
  // tslint:disable-next-line: variable-name
  search_text = '';
  pageSize = 50;
  private searchText$ = new Subject<string>();
  private pageSize$ = new Subject<number>();
  penaltyData: any;
  penaltys: any;
  pageTitle: any;
  fetchPenaltySubscription: any;
  constructor(private notification: NzNotificationService,
    private activatedRoute: ActivatedRoute, private modal: NzModalService,
    private service: ProjectService, private title: Title) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((route: Params) => {
      const { params } = route;
      this.penaltyData = null;
      this.penaltyStatus = params.id;
      this.search_text = '';
      this.pageSize = 10;
      this.getPageTitle(params.id);
      this.fetchAllPenalty();
    });
  }

  
  ngAfterViewInit() {
    this.searchPenaltys();
    this.fetchPageSize();
  }

  getPageTitle(status) {
    switch (status) {
      case '0':
        this.pageTitle = 'New Applications';
        break;
      case '1':
        this.pageTitle = 'Processing Applications';
        break;
      case '2':
        this.pageTitle = 'Processed Applications';
        break;
      case '3':
        this.pageTitle = 'Cancelled Applications';
        break;
      default:
        this.pageTitle = 'Penalty';
    }
    this.title.setTitle(`Penalty | ${this.pageTitle}`);
  }

  searchPenaltys() {
    this.searchText$.pipe(debounceTime(500), distinctUntilChanged(), switchMap(m => {
      this.search_text = m;
      const pageDetails = {
        status: this.penaltyStatus,
        page_size: this.pageSize,
        search_text: m
      };
      return this.service.listPenalty(pageDetails);
    })).subscribe((data: any) => {
      if (data.status === 'success') {
        this.penaltys = data.penals;
        this.penaltyData = data.penals.data;
      }
    });
  }

  fetchPageSize() {
    this.pageSize$.pipe(debounceTime(500), distinctUntilChanged(), switchMap(m => {
      this.pageSize = m;
      const pageDetails = {
        status: this.penaltyStatus,
        page_size: m,
        search_text: this.search_text
      };
      return this.service.listPenalty(pageDetails);
    })).subscribe((data: any) => {
      if (data.status === 'success') {
        this.penaltys = data.penals;
        this.penaltyData = data.penals.data;
      }
    });
  }

  fetchAllPenalty() {
    const params = {
      status: this.penaltyStatus,
      page_size: this.pageSize,
      search_text: this.search_text
    };
    this.fetchPenaltySubscription = this.service.listPenalty(params).subscribe((data: any) => {
      if (data.status === 'success') {
        this.penaltys = data.penals;
        this.penaltyData = data.penals.data;
      }
    });
  }

  performAction() {
    this.modal.create({
      nzTitle: 'Hey!',
      nzContent: `Are you sure you want to ${this.bulkSelectedAction} these penaltys?`,
      nzClosable: false,
      nzOnOk: () => this.performBulkAction(),
      nzOnCancel: () => this.cancelBulkAction()
    });
  }

  changeSearch(search: string) {
    this.searchText$.next(search);
  }

  changePage(num: number) {
    this.pageSize$.next(num);
  }

  cancelBulkAction() {
    this.bulkSelectedAction = null;
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.allChecked = this.penaltyData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = this.penaltyData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.allChecked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.penaltyData.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  performBulkAction() {
    const loanIds = Array.from(this.setOfCheckedId);
    this.isPerformingBulkAction = true;
    this.service.performPenaltyBulkAction({ id: loanIds }, this.bulkSelectedAction).subscribe((data: any) => {
      this.isPerformingBulkAction = false;
      if (data.status === 'success') {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    }, () => {
      this.isPerformingBulkAction = false;
    });
  }

  goNext() {
    if (!this.penaltys.next_page_url) {
      // this.toastr.info('You are on the last page already');
      this.notification.info('Hey!', 'You are on the last page already');
    } else {
      const json = {
        status: this.penaltyStatus,
        search_text: this.search_text,
        page_size: this.pageSize
      };
      this.service.fetchMoreRecords(this.penaltys.next_page_url, json).subscribe((data: any) => {
        if (data.status === 'success') {
          this.penaltys = data.penals;
          this.penaltyData = data.penals.data;
        }
      });
    }
  }

  goPrevious() {
    if (!this.penaltys.prev_page_url) {
      this.notification.info('Hey!', 'You are on the first page already');
    } else {
      const json = {
        status: this.penaltyStatus,
        search_text: this.search_text,
        page_size: this.pageSize
      };
      this.service.fetchMoreRecords(this.penaltys.prev_page_url, json).subscribe((data: any) => {
        if (data.status === 'success') {
          this.penaltys = data.penals;
          this.penaltyData = data.penals.data;
        }
      });
    }
  }
}
