import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefundReportComponent } from './refund-report.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const route: Routes = [
  {
    path: '',
    component: RefundReportComponent
  }
];

@NgModule({
  declarations: [RefundReportComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class RefundReportModule { }
