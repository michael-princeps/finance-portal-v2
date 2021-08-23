import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProjectService } from 'src/app/core/services/project.service';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-upload-repayments',
  templateUrl: './upload-repayments.component.html',
  styleUrls: ['./upload-repayments.component.scss']
})
export class UploadRepaymentsComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  selectedRSPFile: File;
  selectedIPPISFile: File;
  arrayBuffer: any;
  allRSPRepayments: unknown[];
  allIPPISRepayments: unknown[];
  isUploading: boolean;
  type: string | Blob;

  constructor(private service: ProjectService, private notification: NzNotificationService, title: Title) {
    title.setTitle('Import Repayments');
  }

  ngOnInit(): void {
  }

  onRSPInputChange(e) {
    this.selectedRSPFile = e.target.files[0];
    this.viewRSPRepayments();
  }

  onIPPISInputChange(e) {
    this.selectedIPPISFile = e.target.files[0];
    this.viewIPPISRepayments();
  }


  viewRSPRepayments() {
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
      this.allRSPRepayments = param;
    };
    fileReader.readAsArrayBuffer(this.selectedRSPFile);
  }

  viewIPPISRepayments() {
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
      this.allIPPISRepayments = param;
    };
    fileReader.readAsArrayBuffer(this.selectedIPPISFile);
  }


  reset() {
    this.allIPPISRepayments = null;
    this.allRSPRepayments = null;
    this.selectedRSPFile = null;
    this.selectedIPPISFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }


  uploadRSPRepayments() {
    if (!this.type) {
      this.notification.info('Incomplete!', 'Please select type');
    } else {
      const rspFormData = new FormData();
      rspFormData.append('type', this.type);
      rspFormData.append('file', this.selectedRSPFile);
      this.service.uploadRSPRepayment(rspFormData).subscribe((data: any) => {
        if (data.status === 'success') {
          this.notification.success('Successful!', data.message);
          this.reset();
        }
      });
    }
  }

  uploadIPPISRepayments() {
    const ippisData = {
      data: [...this.allIPPISRepayments]
    };
    this.service.uploadIPPISRepayment(ippisData).subscribe((data: any) => {
      if (data.status === 'success') {
        this.notification.success('Successful!', data.message);
        this.reset();
      }
    });
  }
}
