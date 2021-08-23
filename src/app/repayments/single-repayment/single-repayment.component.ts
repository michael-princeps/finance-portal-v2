import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
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
  constructor(private notification: NzNotificationService, private service: ProjectService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param: Params) => {
      this.batchID = param.id;
      this.viewBatchRecords();
    });
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
}
