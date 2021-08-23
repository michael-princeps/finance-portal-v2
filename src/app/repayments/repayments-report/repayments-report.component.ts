import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-repayments-report',
  templateUrl: './repayments-report.component.html',
  styleUrls: ['./repayments-report.component.scss']
})
export class RepaymentsReportComponent implements OnInit, AfterViewInit {
// tslint:disable-next-line: variable-name
search_text = '';
pageSize = 50;
private searchText$ = new Subject<string>();
private pageSize$ = new Subject<number>();
repayments: any;
repaymentsData: any;
type = null;
// tslint:disable-next-line: variable-name
result_status = null;
endDate = null;
startDate = null;
constructor(private notification: NzNotificationService, private service: ProjectService, title: Title) {
  title.setTitle('Repayments Reports');
 }

ngOnInit(): void {
  // this.listRepayments();
}

ngAfterViewInit() {
  this.fetchPageSize();
}


// searchRepayments() {
//   this.searchText$.pipe(debounceTime(500), distinctUntilChanged(), switchMap(m => {
//     this.search_text = m;
//     const pageDetails = {
//       page_size: this.pageSize,
//       search_text: m
//     };
//     return this.service.listRepayments(pageDetails);
//   })).subscribe((data: any) => {
//     if (data.status === 'success') {
//       this.repayments = data.queue;
//       this.repaymentsData = data.queue.data;
//     }
//   });
// }

fetchPageSize() {
  this.pageSize$.pipe(debounceTime(500), distinctUntilChanged(), switchMap(m => {
    this.pageSize = m;
    const pageDetails = {
      type: this.type,
    start_date: this.startDate,
    end_date: this.endDate,
    // tslint:disable-next-line: max-line-length
    result_status: this.type === '1' && this.result_status === 'failed' ? '0' : this.type === '1' && this.result_status === 'completed' ? '1' : this.type === '0' && this.result_status === 'failed' ? '1' : this.type === '0' && this.result_status === 'completed' ? '2' : null,
    search_text: this.search_text,
    page_size: m
    };
    return this.service.listRepaymentsReport(pageDetails);
  })).subscribe((data: any) => {
    if (data.status === 'success') {
      this.repayments = data.repayments;
      this.repaymentsData = data.repayments.data;
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
    type: this.type,
    start_date: this.startDate,
    end_date: this.endDate,
    // tslint:disable-next-line: max-line-length
    result_status: this.type === '1' && this.result_status === 'failed' ? '0' : this.type === '1' && this.result_status === 'completed' ? '1' : this.type === '0' && this.result_status === 'failed' ? '1' : this.type === '0' && this.result_status === 'completed' ? '2' : null,
    search_text: this.search_text,
    page_size: this.pageSize
  };
  this.service.listRepaymentsReport(params).subscribe((data: any) => {
    if (data.status === 'success') {
      this.repayments = data.repayments;
      this.repaymentsData = data.repayments.data;
    }
  });
}

goNext() {
  if (!this.repayments.next_page_url) {
    // this.toastr.info('You are on the last page already');
    this.notification.info('Hey!', 'You are on the last page already');
  } else {
    const json = {
      type: this.type,
      start_date: this.startDate,
      end_date: this.endDate,
      // tslint:disable-next-line: max-line-length
    result_status: this.type === '1' && this.result_status === 'failed' ? '0' : this.type === '1' && this.result_status === 'completed' ? '1' : this.type === '0' && this.result_status === 'failed' ? '1' : this.type === '0' && this.result_status === 'completed' ? '2' : null,
      search_text: this.search_text,
      page_size: this.pageSize
    };
    this.service.fetchMoreRecords(this.repayments.next_page_url, json).subscribe((data: any) => {
      if (data.status === 'success') {
        this.repayments = data.repayments;
        this.repaymentsData = data.repayments.data;
      }
    });
  }
}

goPrevious() {
  if (!this.repayments.prev_page_url) {
    this.notification.info('Hey!', 'You are on the first page already');
  } else {
    const json = {
      type: this.type,
    start_date: this.startDate,
    end_date: this.endDate,
    // tslint:disable-next-line: max-line-length
    result_status: this.type === '1' && this.result_status === 'failed' ? '0' : this.type === '1' && this.result_status === 'completed' ? '1' : this.type === '0' && this.result_status === 'failed' ? '1' : this.type === '0' && this.result_status === 'completed' ? '2' : null,
    search_text: this.search_text,
    page_size: this.pageSize
    };
    this.service.fetchMoreRecords(this.repayments.prev_page_url, json).subscribe((data: any) => {
      if (data.status === 'success') {
        this.repayments = data.repayments;
        this.repaymentsData = data.repayments.data;
      }
    });
  }
}
}
