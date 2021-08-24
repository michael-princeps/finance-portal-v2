import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-rollover-investment',
  templateUrl: './rollover-investment.component.html',
  styleUrls: ['./rollover-investment.component.scss']
})
export class RolloverInvestmentComponent implements OnInit {
  rolloverForm: FormGroup;

  constructor(private fb: FormBuilder, private service: ProjectService, private notification: NzNotificationService, title: Title) {
    title.setTitle('Investment Rollover');
   }

  ngOnInit(): void {
    this.rolloverForm = this.fb.group({
      savings_id: [null, Validators.required],
      duration: [null, Validators.required],
      notify: [null],
    });
  }

  processRollover() {
    Object.keys(this.rolloverForm.controls).forEach(key => {
      this.rolloverForm.controls[key].markAsDirty();
      this.rolloverForm.controls[key].updateValueAndValidity();
    });
    if (this.rolloverForm.valid) {
      this.rolloverForm.disable();
      this.service.processRollover(this.rolloverForm.value).subscribe((data: any) => {
        this.rolloverForm.enable();
        if (data.status === 'success') {
          this.notification.success('Successful!', data.message);
          this.rolloverForm.reset();
        }
      }, () => this.rolloverForm.enable());
    }
  }
}
