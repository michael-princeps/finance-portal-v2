import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { banks } from 'src/app/banks';
import { ProjectService } from 'src/app/core/services/project.service';

function toggleAllButtonsDisable(value) {
  const buttons: any = document.getElementsByTagName('button');
  for (const button of buttons) {
    button.disabled = value;
  }
}

@Component({
  selector: 'app-single-refund',
  templateUrl: './single-refund.component.html',
  styleUrls: ['./single-refund.component.scss']
})
export class SingleRefundComponent implements OnInit, AfterViewInit {
  @ViewChildren('pageModal') pageModals: QueryList<NzModalRef>;
  refund: any;
  refundsData: any;
  itemID: any;
  creator: any;
  initialapprover: any;
  finalapprover: any;
  finalamount: any;
  loanDiskDetails: any;
  loanApplicationDetails: any;
  ippisVerficationData: any;
  banks = banks;
  reason = '';
  amount: any;
  rejectModal: boolean;
  approvalModal: boolean;
  cancelModal: boolean;
  constructor(private activatedRoute: ActivatedRoute, private title: Title, private service: ProjectService, private notification: NzNotificationService) {
    this.title.setTitle('View Refund');
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param: Params) => {
      this.itemID = param.id;
      this.viewRefund(param.id);
    });
  }

  ngAfterViewInit() {
    this.pageModals.changes.subscribe(() => {
      if (this.pageModals.toArray().length) {
        this.pageModals.toArray().forEach(modal => {
          modal.afterOpen.subscribe(() => {
            toggleAllButtonsDisable(false);
          });
        });
      }
    });
  }

  getBankName(value) {
    if (value) {
      const foundbank = banks.find(bank => bank.bankcode.toLowerCase() === value.toLowerCase());
      if (foundbank) {
        return foundbank.name;
      } else {
        return 'None';
      }
    } else {
      return 'None';
    }
  }

  getAdminFees(amount) {
    return ((amount * 0.03) + 1250);
  }

  viewRefund(id) {
    this.service.viewSingleRefund(id).subscribe((data: any) => {
      if (data.status === 'success') {
        this.refundsData = data;
        this.refund = data.refunds;
        this.creator = data.creator;
        this.initialapprover = data.initialapprover;
        this.finalapprover = data.finalapprover;
        this.finalamount = this.refund.initialamount;
        this.loanDiskDetails = data.loandisk;
        this.loanApplicationDetails = data.loan_application;
        this.ippisVerficationData = data.ippis_Verification;
        this.title.setTitle(`View Refund | ${this.loanApplicationDetails.firstname} ${this.loanApplicationDetails.lastname}`);
      }
    });
  }

  retryRefund() {

  }

  cancelRefund() {
    const details = {
      id: this.itemID,
      reason: this.reason
    };
    this.service.cancelRefund(details).subscribe((data: any) => {
      if (data.status === 'success') {
        this.notification.success('Successful!', data.message);
        this.handleCancelRefund();
        this.viewRefund(this.itemID);
      }
    });
  }

  rejectRefund() {
    const details = {
      id: this.itemID,
      reason: this.reason
    };
    this.service.rejectRefund(details).subscribe((data: any) => {
      if (data.status === 'success') {
        this.notification.success('Successful!', data.message);
        this.handleCancelRejectRefund();
        this.viewRefund(this.itemID);
      }
    });
  }

  approveRefund(status) {
    let obj;
    let url;
    if (status == '0') {
      url = 'initial';
      obj = {
        id: this.itemID,
        reason: this.reason,
        initialamount: this.amount
      };
    } else {
      url = 'final';
      obj = {
        id: this.itemID,
        reason: this.reason,
        finalamount: this.amount
      };
    }
    this.service.approveRefund(obj, url).subscribe((data: any) => {
      if (data.status === 'success') {
        this.notification.success('Successful!', data.message);
        this.handleCancelApproval();
        this.viewRefund(this.itemID);
      }
    });
  }

  handleCancelRejectRefund() {
    this.rejectModal = false;
    this.amount = null;
    this.reason = null;
  }

  handleCancelRefund() {
    this.cancelModal = false;
    this.amount = null;
    this.reason = null;
  }

  handleCancelApproval() {
    this.approvalModal = false;
    this.amount = null;
    this.reason = null;
  }

  
}
