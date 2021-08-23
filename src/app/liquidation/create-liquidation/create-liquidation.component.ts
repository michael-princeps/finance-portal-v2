import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-create-liquidation',
  templateUrl: './create-liquidation.component.html',
  styleUrls: ['./create-liquidation.component.scss']
})
export class CreateLiquidationComponent implements OnInit {
  createLiquidationForm: FormGroup;
  constructor(private fb: FormBuilder, private service: ProjectService, private notification: NzNotificationService, private title: Title) {
    this.title.setTitle('Create Liquidation');
   }

  ngOnInit(): void {
    this.createLiquidationForm = this.fb.group({
      loanid: [null, Validators.required],
      date: [null],
      email: [null, [Validators.required, Validators.email]]
    });
  }


  createLiquidationRequest() {
    Object.keys(this.createLiquidationForm.controls).forEach(key => {
      this.createLiquidationForm.controls[key].markAsDirty();
      this.createLiquidationForm.controls[key].updateValueAndValidity();
    });
    if (this.createLiquidationForm.valid) {
      this.createLiquidationForm.disable();
      this.service.createLiquidationRequest(this.createLiquidationForm.value).subscribe((data: any) => {
        this.createLiquidationForm.enable();
        if (data.status === 'success') {
          this.notification.success('Successful!', data.message);
          this.createLiquidationForm.reset();
        }
      }, () => this.createLiquidationForm.enable());
    } else {
      this.notification.info('Invalid!', 'Please fill form first');
    }
  }
}
