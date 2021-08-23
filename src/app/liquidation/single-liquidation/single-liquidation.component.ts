import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-single-liquidation',
  templateUrl: './single-liquidation.component.html',
  styleUrls: ['./single-liquidation.component.scss']
})
export class SingleLiquidationComponent implements OnInit {
  liquidation: any;
  liquidationDate: any;
  liquidateObject: { loanid: any; amount_paid: any; date: any; };
  liquidateModal: boolean;
  itemID: any;
  constructor(private service: ProjectService, private activatedRoute: ActivatedRoute, private notification: NzNotificationService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param: Params) => {
      this.itemID = param.id;
      this.fetchLiquidationDetails();
    })
  }


  fetchLiquidationDetails() {
    this.service.viewSingleLiquidation(this.itemID).subscribe((data: any) => {
      if (data.status === 'success') {
        this.liquidation = data.liquidation;
        this.liquidateObject = {
          loanid: this.liquidation.loan_id,
          amount_paid: this.liquidation.liquidationamount,
          date: this.liquidationDate
        }
      }
    });
  }

  getOverdueLoanBalance() {
    return parseFloat(this.liquidation.loanamount) + parseFloat(this.liquidation.accruedinterest) - parseFloat(this.liquidation.paidamount);
  }

  getLoanBalance() {
    return parseFloat(this.liquidation.loanamount) + parseFloat(this.liquidation.adminfees) + parseFloat(this.liquidation.accruedinterest) - parseFloat(this.liquidation.paidamount);
  }

  liquidateLoan() {
    const data = {
      id: this.liquidation.id,
      loanid: this.liquidateObject.loanid,
      amount_paid: this.liquidateObject.amount_paid,
      date: this.liquidationDate
    }
    this.service.liquidateManually(data).subscribe((data: any) => {
      if (data.status === 'success') {
        this.notification.success('Successful!', data.message);
        this.handleCancelLiquidate();
        this.fetchLiquidationDetails();
      }
    })
  }

  cancelLiquidation() {
    const data = {
      id: this.liquidation.id,
      status: 2
    }
    this.service.updateLiquidationStatus(data).subscribe((data: any) => {
      if (data.status === 'success') {
        this.notification.success('Successful!', data.message);
        this.fetchLiquidationDetails();
      }
    })
  }

  handleCancelLiquidate() {
    this.liquidateModal = false;
    this.liquidateObject.amount_paid = this.liquidateObject.amount_paid;
  }
}
