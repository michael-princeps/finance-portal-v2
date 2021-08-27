import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { withLatestFrom } from 'rxjs/operators';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-single-repayment',
  templateUrl: './single-repayment.component.html',
  styleUrls: ['./single-repayment.component.scss']
})
export class SingleRepaymentComponent implements OnInit {
  creditWallet: any[] = [];
  batchName: any;
  allBatchData: any;
  existingTransactionReference: any[] = [];
  creditAlert: any[] = [];
  notFound: any[] = [];
  totalCreditWalletAmt: any;
  totalCreditAlertAmt: any;
  totalNotFoundAmt: any;
  totalExistingTransactionAmt: any;
  statusId: any;
  // tslint:disable-next-line: variable-name
  page_size = 10;
  // tslint:disable-next-line: variable-name
  search_text = '';
  ippisRepayments: any[] = [];
  totalIppisRepaymentsAmt: any;
  existingIPPIS: any[] = [];
  totalExistingIPPISAmt: any;
  documentInfo: any;
  batchInfo: any;
  // tslint:disable-next-line: max-line-length
  constructor(private notification: NzNotificationService, private service: ProjectService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // this.activatedRoute.url.pipe(withLatestFrom(this.activatedRoute.params, this.activatedRoute.queryParams)).subscribe((param: Params) => {
    //   this.batchName = param[1].name;
    //   this.viewBatchRecords();
    // });
    this.activatedRoute.params.subscribe((param: Params) => {
      this.batchName = param.name;
      this.viewBatchRecords();
    });
  }

  viewBatchRecords() {
    const batchData = {
      batch_name: this.batchName
    };
    this.service.viewBatchRecords(batchData).subscribe((data: any) => {
      if (data.status === 'success') {
        this.batchInfo = data;
        this.documentInfo = data.document_info;
        this.allBatchData = data.data;
        this.creditWallet =  (this.allBatchData.data as any[]).filter((item) => item.process_type === '1');
        this.totalCreditWalletAmt = this.creditWallet.reduce((acc, { amount }) => acc + parseFloat(amount), 0);
        this.existingTransactionReference =  (this.allBatchData.data as any[]).filter((item) => item.process_type === '2');
        this.totalExistingTransactionAmt = this.existingTransactionReference.reduce((acc, { amount }) => acc + parseFloat(amount), 0);
        this.creditAlert =  (this.allBatchData.data as any[]).filter((item) => item.process_type === '3');
        this.totalCreditAlertAmt = this.creditAlert.reduce((acc, { amount }) => acc + parseFloat(amount), 0);
        this.notFound =  (this.allBatchData.data as any[]).filter((item) => item.process_type === '4');
        this.totalNotFoundAmt = this.notFound.reduce((acc, { amount }) => acc + parseFloat(amount), 0);
        this.ippisRepayments =  (this.allBatchData.data as any[]).filter((item) => item.process_type === '5');
        this.totalIppisRepaymentsAmt = this.ippisRepayments.reduce((acc, { amount }) => acc + parseFloat(amount), 0);
        this.existingIPPIS =  (this.allBatchData.data as any[]).filter((item) => item.process_type === '6');
        this.totalExistingIPPISAmt = this.ippisRepayments.reduce((acc, { amount }) => acc + parseFloat(amount), 0);
      }
    });
  }

  changeRepaymentStatus() {
    const repaymentObj = {
      process_status: '2',
      name: this.batchName
    };
    this.service.changeRepaymentStatus(repaymentObj).subscribe((data: any) => {
      if (data.status === 'success') {
        this.notification.success('Successful!', data.message);
        this.creditWallet = [];
      }
    });
  }

  uploadCreditWalletRepayments() {
    this.service.uploadCreditWalletRepayments(this.creditWallet).subscribe((data: any) => {
      if (data.status === 'success') {
        this.notification.success('Successful!', data.message);
        this.creditWallet = [];
      }
    });
  }

  uploadNotFoundRepayments() {
    this.service.uploadNotFoundRepayments(this.creditWallet).subscribe((data: any) => {
      if (data.status === 'success') {
        this.notification.success('Successful!', data.message);
        this.notFound = [];
      }
    });
  }

  export(data: Array<any>, title: string) {
    // const reportdata = [];
    // for (let index = 0; index < data.length; ++index) {
    //   const json = {
    //     'S/No': index + 1,
    //     'Mandate Reference': data[index].mandatereference,
    //     Amount: data[index].amount,
    //     'Payment Date': data[index].paymentdate,
    //     'Transaction Reference': data[index].transactionreference,
    //   };
    //   reportdata[index] = json;
    // }
    const newData = data.map((item, index) => {
      return  {
        'S/No': index + 1,
        'Mandate Reference': item.mandatereference,
        Amount: item.amount,
        'Payment Date': item.paymentdate,
        'Transaction Reference': item.transactionreference,
      };
    });

    console.table(newData);
    this.service.exportAsExcelFile(newData, title);
  }

  changeBatchStatus() {
    this.service.changeBatchStatus({ id: 2 }).subscribe((data: any) => {
      if (data.status === 'success') {
        this.notification.success('Successful!', data.message);
        this.router.navigate([], { relativeTo: this.activatedRoute });
      }
    });
  }
}
