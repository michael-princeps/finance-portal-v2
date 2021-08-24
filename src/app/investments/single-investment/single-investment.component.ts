import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProjectService } from 'src/app/core/services/project.service';
import { banks } from 'src/app/banks';

declare const $: any;

@Component({
  selector: 'app-single-investment',
  templateUrl: './single-investment.component.html',
  styleUrls: ['./single-investment.component.scss']
})
export class SingleInvestmentComponent implements OnInit {
  investment: any;
  investmentUser: any;
  investmentId: any;
  amount: any;
  duration: any;
  interestrate: any;
  startdate: any;
  investmentTransactions: any[];
  portalLink: string;
  banks = banks;
  // tslint:disable-next-line: max-line-length
  constructor(private service: ProjectService, private activatedRoute: ActivatedRoute, private location: Location, private router: Router, private notification: NzNotificationService, private title: Title) {
    title.setTitle('View Investment');
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.investmentId = params.id;
      this.fetchInvestment();
    });
  }

  formatTextToNumber(valString) {
    if (!valString) {
      return '';
    }
    const val = valString.toString();
    const parts = this.unFormatNumberBackToText(val).split('.');
    return parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, ',') + (!parts[1] ? '' : '.' + parts[1]);
  }


  unFormatNumberBackToText(val) {
    if (!val) {
      return '';
    }
    val = val.replace(/^0+/, '');

    if (val.includes(',')) {
      return val.replace(/,/g, '');
    } else {
      return val.replace(/\./g, '');
    }
  }

  setInterest() {
    if (this.interestrate < 2) {
      this.interestrate = 2;
      alert('Interest should be between 2 to 5 percent');
    }
    if (this.interestrate > 5) {
      this.interestrate = 2;
      alert('Interest should be between 2 to 5 percent');
    }

  }

  cancelInvestment() {
    this.service.cancelInvestment({ id: this.investmentId }).subscribe((data: any) => {
      if (data.status === 'success') {
        this.notification.success('Successful!', data.message);
        this.location.back();
      }
    });
  }

  populateForm() {
    this.amount = this.investment.amount;
    this.duration = this.investment.duration;
    this.interestrate = this.investment.interestrate;
    this.startdate = this.investment.startdate;
  }

  makeReferral(id) {
    this.service.makeInvestmentReferral({ id }).subscribe((data: any) => {
      if (data.status === 'success') {
        console.log(data);
        this.notification.success('Successful', data.message);
        location.reload();
      }
    });
  }

  fetchInvestment() {
    this.service.fetchOneInvestment({ id: this.investmentId }).subscribe((data: any) => {
      if (data.status === 'success') {
        this.investmentUser = data.investment_user;
        this.title.setTitle(`View ${this.investmentUser.firstname} ${this.investmentUser.lastname} Investment`)
        this.investment = data.investment;
        this.investmentTransactions = data.investment_transactions;
        if (this.investmentUser.numberofinvestment > 1) {
          this.portalLink = 'https://customer.creditwallet.ng';
        }
      }
    });
  }

  processInvestment() {
    if (!this.amount) {
      this.notification.info('Incomplete!', 'Amount is required');
      return;
    }
    const json = {
      id: this.investmentId,
      amount: this.unFormatNumberBackToText(this.amount),
      interestrate: this.interestrate,
      duration: this.duration,
      startdate: this.startdate.singleDate.formatted
    };
    this.service.processInvestment(json).subscribe((data: any) => {
      if (data.status === 'success') {
        $('#myModal').modal('hide');
        this.notification.success('Successful', data.message);
        location.reload();
      }
    });
  }

  confirmPayment() {
    if (!this.amount) {
      this.notification.info('Incomplete!', 'Amount is required');
      return;
    }
    const json = {
      id: this.investmentId,
      amount: this.unFormatNumberBackToText(this.amount),
      interestrate: this.interestrate,
      duration: this.duration,
      startdate: this.startdate.singleDate.formatted
    };
    this.service.confirmInvestment(json).subscribe((data: any) => {
      if (data.status === 'success') {
        $('#myModalConfirm').modal('hide');
        this.notification.success('Successful', data.message);
        location.reload();
      }
    });
  }

  completeInvestment() {
    const json = {
      id: this.investmentId,
      link: this.portalLink
    };
    this.service.completeInvestment(json).subscribe((data: any) => {
      if (data.status === 'success') {
        console.log(data);
        this.notification.success('Successful', data.message);
        location.reload();
      }

    });
  }

  editInvestor() {
    this.service.editInvestment(this.investmentUser).subscribe((data: any) => {
      if (data.status === 'success') {
        $('#myModalEdit').modal('hide');
        this.notification.success('Edit Successful', data.message);
      }

    });

  }
}
