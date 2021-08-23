import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProjectService } from 'src/app/core/services/project.service';
import * as XLSX from 'ts-xlsx';

@Component({
  selector: 'app-upload-maturity-data',
  templateUrl: './upload-maturity-data.component.html',
  styleUrls: ['./upload-maturity-data.component.scss']
})
export class UploadMaturityDataComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  uploadMaturityForm: FormGroup;
  allUploads: unknown[];
  selectedFile: File;
  arrayBuffer: any;
  isUploading: boolean;
  constructor(private fb: FormBuilder, private title: Title, private service: ProjectService, private notification: NzNotificationService) {
    this.title.setTitle('Uplaod Maturity Data');
    this.uploadMaturityForm = this.fb.group({
      savings_id: [null, Validators.required],
      investor_name: [null, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onInputChange(e) {
    this.selectedFile = e.target.files[0];
    this.viewAllData();
  }

  reset() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.selectedFile = null;
    this.allUploads = null;
  }

  viewAllData() {
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
  submitForm() {
    Object.keys(this.uploadMaturityForm.controls).forEach(key => {
      this.uploadMaturityForm.controls[key].markAsDirty();
      this.uploadMaturityForm.controls[key].updateValueAndValidity();
    });
    if (this.uploadMaturityForm.valid) {
      this.uploadMaturityForm.disable();
      this.service.uploadMaturityData(this.uploadMaturityForm.value).subscribe((data: any) => {
        this.uploadMaturityForm.enable();
        if (data.status === 'success') {
          this.notification.success('Successful!', data.message);
          this.uploadMaturityForm.reset();
        }
      }, () => this.uploadMaturityForm.enable());
    }
  }

  uploadBulkForm() {
    const uploadData = {
      data: [...this.allUploads]
    };
    this.isUploading = true;
    this.service.uploadMaturityData(uploadData).subscribe((data: any) => {
      if (data.status === 'success') {
        this.notification.success('Successful', data.message);
        this.reset();
      }
    });
  }

  changeIndex(eve) {
    this.uploadMaturityForm.reset();
    this.reset();
  }
}
