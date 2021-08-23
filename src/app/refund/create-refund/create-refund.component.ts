import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { banks } from 'src/app/banks';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-create-refund',
  templateUrl: './create-refund.component.html',
  styleUrls: ['./create-refund.component.scss']
})
export class CreateRefundComponent implements OnInit {
  createRefundForm: FormGroup;
  comment = 'Verification done and customer is due for refund';
  verifiedAccount: boolean;
  verifiedRefundDetails: any;
  refundDetails: {loanid: string};
  constructor(private service: ProjectService, private activatedRoute: ActivatedRoute, private notification: NzNotificationService, private fb: FormBuilder, private title: Title) {
    this.title.setTitle('Create Refund');

    this.activatedRoute.queryParams.subscribe((refund: {loanid: string}) => {
      this.refundDetails = refund;
    });
   }

  ngOnInit(): void {
    this.createRefundForm = this.fb.group({
      loanid: [this.refundDetails.loanid, Validators.required],
      amount: [null, Validators.required],
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


  fetchRefundDetails() {
    Object.keys(this.createRefundForm.controls).forEach(key => {
      this.createRefundForm.controls[key].markAsDirty();
      this.createRefundForm.controls[key].updateValueAndValidity();
    });
    if (this.createRefundForm.valid) {
      this.verifiedAccount = false;
      this.verifiedRefundDetails = null;
      this.createRefundForm.disable();
      this.service.fetchRefundDetails(this.createRefundForm.value).subscribe((data: any) => {
        this.createRefundForm.enable();
        if (data.status === 'success') {
          this.verifiedAccount = true;
          this.verifiedRefundDetails = data;
        }
      }, err => this.createRefundForm.enable());
    } else {
      this.notification.info('Invalid!', 'Please fill form first');
    }
  }

  initiateRefund() {
    const details = {
      ...this.verifiedRefundDetails,
      comment: this.comment
    };
    this.createRefundForm.disable();
    this.service.initiateRefundDetails(details).subscribe((data: any) => {
      this.createRefundForm.reset();
      if (data.status === 'success') {
        this.verifiedAccount = false;
        this.verifiedRefundDetails = null;
        this.comment = 'Verification done and customer is due for refund';
        this.notification.success('Successful!', data.message);
      }
    },  err => this.createRefundForm.enable());
  }
}
