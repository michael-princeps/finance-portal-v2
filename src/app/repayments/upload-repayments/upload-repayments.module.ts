import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadRepaymentsComponent } from './upload-repayments.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const route: Routes = [
  {
    path: '',
    component: UploadRepaymentsComponent
  }
];

@NgModule({
  declarations: [UploadRepaymentsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class UploadRepaymentsModule { }
