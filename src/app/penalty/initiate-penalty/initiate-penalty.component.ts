import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/core/services/project.service';
import * as XLSX from 'ts-xlsx';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-initiate-penalty',
  templateUrl: './initiate-penalty.component.html',
  styleUrls: ['./initiate-penalty.component.scss']
})
export class InitiatePenaltyComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  singleUploadForm: FormGroup;
  allUploads: unknown[];
  selectedFile: File;
  arrayBuffer: any;
  isUploading: boolean;
  constructor(private fb: FormBuilder, private service: ProjectService, private title: Title, private notification: NzNotificationService) {
    this.title.setTitle('Upload Penalty');
  }

  ngOnInit(): void {
    this.singleUploadForm = this.fb.group({
      loanid: [null, Validators.required]
    });
  }

  onInputChange(e) {
    this.selectedFile = e.target.files[0];
    this.viewPenalty();
  }

  reset() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.selectedFile = null;
    this.allUploads = null;
  }

  viewPenalty() {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const param = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.allUploads = param;
    };
    fileReader.readAsArrayBuffer(this.selectedFile);
  }

  uploadSingleForm() {
    Object.keys(this.singleUploadForm.controls).forEach(key => {
      this.singleUploadForm.controls[key].markAsDirty();
      this.singleUploadForm.controls[key].updateValueAndValidity();
    });
    if (this.singleUploadForm.valid) {
      this.singleUploadForm.disable();
      this.service.uploadSinglePenalty(this.singleUploadForm.value).subscribe((data: any) => {
        this.singleUploadForm.enable();
        if (data.status === 'success') {
          this.notification.success('Successful!', data.message);
          this.singleUploadForm.reset();
        }
      }, () => this.singleUploadForm.enable());
    } else {
      this.notification.info('Invalid!', 'Please fill form first');
    }
  }

  uploadBulkForm() {
    const uploadData = {
      data: [...this.allUploads]
    };
    this.isUploading = true;
    this.service.uploadBulkPenalty(uploadData).subscribe((data: any) => {
      if (data.status === 'success') {
        this.notification.success('Successful', data.message);
        this.reset();
      }
    });
  }

  changeIndex(eve) {
    this.singleUploadForm.reset();
    this.reset();
  }
}
