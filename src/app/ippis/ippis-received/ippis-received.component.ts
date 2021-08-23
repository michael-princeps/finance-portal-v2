import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from 'src/app/core/services/project.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import * as XLSX from 'ts-xlsx';
import { months } from 'src/app/months';

function toggleAllButtonsDisable(value) {
  const buttons: any = document.getElementsByTagName('button');
  for (const button of buttons) {
    button.disabled = value;
  }
}

@Component({
  selector: 'app-ippis-received',
  templateUrl: './ippis-received.component.html',
  styleUrls: ['./ippis-received.component.scss']
})
export class IppisReceivedComponent implements OnInit, AfterViewInit {
  @ViewChild('file') file: ElementRef;  
  @ViewChild('pageModal') pageModals: NzModalRef;

  importModal: boolean;
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
  selectedFile: File;
  filename: string;
  arrayBuffer: any;
  months = months;
  availableYears: number[];
  constructor(private notification: NzNotificationService, private service: ProjectService, private title: Title, private modalService: NzModalService) {
    this.title.setTitle('IPPIS | Payment Received');
  }

  ngOnInit(): void {
    this.availableYears = [this.defaultYear - 2, this.defaultYear - 1, this.defaultYear, this.defaultYear + 1, this.defaultYear + 2];
  }

  ngAfterViewInit() {
    this.pageModals.afterClose.subscribe(() => toggleAllButtonsDisable(false))
  }

  onInputChange(event) {
    console.log(event.target.files[0]);
    this.selectedFile = event.target.files[0];
    this.filename = this.selectedFile.name;
  }

  resetInput() {
    this.file.nativeElement.value = '';
    this.filename = null;
  }

  uploadPayment() {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];
      const param = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      console.log(param);
      this.paymentsToUpload = param;
      if (this.paymentsToUpload.length) {
        this.resetInput();
        this.handleCancelImport();
        this.totalsum = this.paymentsToUpload.reduce((acc, { amount_paid }) => acc + parseFloat(amount_paid), 0);
        this.totalcount = this.paymentsToUpload.length;
      }
      // this.processbankstatement(param);

    };
    fileReader.readAsArrayBuffer(this.selectedFile);
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

  handleCancelImport() {
    this.file.nativeElement.value = '';
    this.filename = null;
    this.importModal = false;
  }
}
