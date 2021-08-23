import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-list-repayments-queue',
  templateUrl: './list-repayments-queue.component.html',
  styleUrls: ['./list-repayments-queue.component.scss']
})
export class ListRepaymentsQueueComponent implements OnInit, AfterViewInit {
  // tslint:disable-next-line: variable-name
  search_text = '';
  pageSize = 50;
  private searchText$ = new Subject<string>();
  private pageSize$ = new Subject<number>();
  repayments: any;
  repaymentsData: any;
  constructor(private notification: NzNotificationService, private service: ProjectService, title: Title) {
    title.setTitle('Repayments Queue');
   }

  ngOnInit(): void {
    this.listRepayments();
  }

  ngAfterViewInit() {
    this.searchRepayments();
    this.fetchPageSize();
  }


  searchRepayments() {
    this.searchText$.pipe(debounceTime(500), distinctUntilChanged(), switchMap(m => {
      this.search_text = m;
      const pageDetails = {
        page_size: this.pageSize,
        search_text: m
      };
      return this.service.listRepayments(pageDetails);
    })).subscribe((data: any) => {
      if (data.status === 'success') {
        this.repayments = data.queue;
        this.repaymentsData = data.queue.data;
      }
    });
  }

  fetchPageSize() {
    this.pageSize$.pipe(debounceTime(500), distinctUntilChanged(), switchMap(m => {
      this.pageSize = m;
      const pageDetails = {
        page_size: m,
        search_text: this.search_text
      };
      return this.service.listRepayments(pageDetails);
    })).subscribe((data: any) => {
      if (data.status === 'success') {
        this.repayments = data.queue;
        this.repaymentsData = data.queue.data;
      }
    });
  }

  changeSearch(search: string) {
    this.searchText$.next(search);
  }

  changePage(num: number) {
    this.pageSize$.next(num);
  }

  listRepayments() {
    const params = {
      type: '1',
      search_text: this.search_text,
      page_size: this.pageSize
    };
    this.service.listRepayments(params).subscribe((data: any) => {
      if (data.status === 'success') {
        this.repayments = data.queue;
        this.repaymentsData = data.queue.data;
      }
    });
  }

  goNext() {
    if (!this.repayments.next_page_url) {
      // this.toastr.info('You are on the last page already');
      this.notification.info('Hey!', 'You are on the last page already');
    } else {
      const json = {
        type: '1',
        search_text: this.search_text,
        page_size: this.pageSize
      };
      this.service.fetchMoreRecords(this.repayments.next_page_url, json).subscribe((data: any) => {
        if (data.status === 'success') {
          this.repayments = data.queue;
          this.repaymentsData = data.queue.data;
        }
      });
    }
  }

  goPrevious() {
    if (!this.repayments.prev_page_url) {
      this.notification.info('Hey!', 'You are on the first page already');
    } else {
      const json = {
        type: '1',
        search_text: this.search_text,
        page_size: this.pageSize
      };
      this.service.fetchMoreRecords(this.repayments.prev_page_url, json).subscribe((data: any) => {
        if (data.status === 'success') {
          this.repayments = data.queue;
          this.repaymentsData = data.queue.data;
        }
      });
    }
  }
}
