import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-list-repayment-uploads',
  templateUrl: './list-repayment-uploads.component.html',
  styleUrls: ['./list-repayment-uploads.component.scss']
})
export class ListRepaymentUploadsComponent implements OnInit, AfterViewInit {
// tslint:disable-next-line: variable-name
search_text = '';
pageSize = 50;
private searchText$ = new Subject<string>();
private pageSize$ = new Subject<number>();
repayments: any;
repaymentsData: any;
status = null;
type = null;
constructor(private notification: NzNotificationService, private service: ProjectService, title: Title) {
  title.setTitle('List Uploaded Repayments');
}

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.fetchPageSize();
  }


  // searchRepayments() {
  //   this.searchText$.pipe(debounceTime(500), distinctUntilChanged(), switchMap(m => {
  //     this.search_text = m;
  //     const pageDetails = {
  //       type: this.type,
  //       status: this.status,
  //       page_size: this.pageSize,
  //       search_text: m
  //     };
  //     return this.service.listUploadedRepayments(pageDetails);
  //   })).subscribe((data: any) => {
  //     if (data.status === 'success') {
  //       this.repayments = data.repayments;
  //       this.repaymentsData = data.repayments.data;
  //     }
  //   });
  // }

  fetchPageSize() {
    this.pageSize$.pipe(debounceTime(500), distinctUntilChanged(), switchMap(m => {
      this.pageSize = m;
      const pageDetails = {
        type: this.type,
        // tslint:disable-next-line: max-line-length
        status: this.status,
        page_size: m,
        search_text: this.search_text
      };
      return this.service.listUploadedRepayments(pageDetails);
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
    if (!this.type) {
      this.notification.info('Incomplete!', 'Please select type');
    } else {
      const params = {
        // tslint:disable-next-line: max-line-length
        status: this.status,
        type: this.type,
        search_text: this.search_text,
        page_size: this.pageSize
      };
      this.service.listUploadedRepayments(params).subscribe((data: any) => {
        if (data.status === 'success') {
          this.repayments = data.repayments;
          this.repaymentsData = data.repayments.data;
        }
      });
    }
  }

  goNext() {
    if (!this.repayments.next_page_url) {
      // this.toastr.info('You are on the last page already');
      this.notification.info('Hey!', 'You are on the last page already');
    } else {
      const json = {
         // tslint:disable-next-line: max-line-length
        status: this.status,
        type: this.type,
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
         // tslint:disable-next-line: max-line-length
        status: this.status,
        type: this.type,
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
