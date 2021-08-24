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
  batchID: any;
  allBatchData: any;
  existingTransactionReference: any[] = [];
  creditAlert: any[] = [];
  notFound: any[] = [];
  totalCreditWalletAmt: any;
  totalCreditAlertAmt: any;
  totalNotFoundAmt: any;
  totalExistingTransactionAmt: any;
  statusId: any;
  constructor(private notification: NzNotificationService, private service: ProjectService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.url.pipe(withLatestFrom(this.activatedRoute.params, this.activatedRoute.queryParams)).subscribe((param: Params) => {
      this.batchID = param[1].id;
      this.statusId = param[2].status;
      this.viewBatchRecords();
    });
    // this.activatedRoute.params.subscribe((param: Params) => {
    //   this.batchID = param.id;
    //   console.log()
    // });
  }

  viewBatchRecords() {
    const batchData = {
      id: this.batchID
    };
    this.service.viewBatchRecords(batchData).subscribe((data: any) => {
      if (data.status === 'success') {
        this.allBatchData = data;
        this.creditWallet = data.creditwallet;
        this.totalCreditWalletAmt = this.creditWallet.reduce((acc, { amount }) => acc + parseFloat(amount), 0);
        this.existingTransactionReference = data.existingtransactionreference;
        this.totalExistingTransactionAmt = this.existingTransactionReference.reduce((acc, { amount }) => acc + parseFloat(amount), 0);
        this.creditAlert = data.creditalert;
        this.totalCreditAlertAmt = this.creditAlert.reduce((acc, { amount }) => acc + parseFloat(amount), 0);
        this.notFound = data.notfound;
        this.totalNotFoundAmt = this.notFound.reduce((acc, { amount }) => acc + parseFloat(amount), 0);
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
    const reportdata = [];
    for (let index = 0; index < data.length; ++index) {
      const json = {
        'S/No': index + 1,
        'Mandate Reference': data[index].mandatereference,
        Amount: data[index].amount,
        'Payment Date': data[index].paymentdate,
        'Transaction Reference': data[index].transactionreference,
      };
      reportdata[index] = json;
    }

    console.log(reportdata);
    this.service.exportAsExcelFile(reportdata, title);
  }

  changeBatchStatus() {
    this.service.changeBatchStatus({ id: this.batchID }).subscribe((data: any) => {
      if (data.status === 'success') {
        this.notification.success('Successful!', data.message);
        this.router.navigate([], { relativeTo: this.activatedRoute });
      }
    });
  }
}
