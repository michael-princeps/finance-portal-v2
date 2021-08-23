import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepaymentsReportComponent } from './repayments-report.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const route: Routes = [
  {
    path: '',
    component: RepaymentsReportComponent
  }
];

@NgModule({
  declarations: [RepaymentsReportComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class RepaymentsReportModule { }
