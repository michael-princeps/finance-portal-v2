import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-send-maturity-email',
  templateUrl: './send-maturity-email.component.html',
  styleUrls: ['./send-maturity-email.component.scss']
})
export class SendMaturityEmailComponent implements OnInit {
  sendMaturityEmailForm: FormGroup;
  constructor(private fb: FormBuilder, private title: Title, private service: ProjectService, private notification: NzNotificationService) {
    this.title.setTitle('Send Maturity Email');
   }

  ngOnInit(): void {
    this.sendMaturityEmailForm = this.fb.group({
      borrower_id: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]]
    });
  }

  submitForm() {
    Object.keys(this.sendMaturityEmailForm.controls).forEach(key => {
      this.sendMaturityEmailForm.controls[key].markAsDirty();
      this.sendMaturityEmailForm.controls[key].updateValueAndValidity();
    });
    if (this.sendMaturityEmailForm.valid) {
      this.sendMaturityEmailForm.disable();
      this.service.sendMaturityEmail(this.sendMaturityEmailForm.value).subscribe((data: any) => {
        this.sendMaturityEmailForm.enable();
        if (data.status === 'success') {
          this.notification.success('Successful!', data.message);
          this.sendMaturityEmailForm.reset();
        }
      }, () => this.sendMaturityEmailForm.enable());
    }
  }
}
