import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListRepaymentUploadsComponent } from './list-repayment-uploads.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const route: Routes = [
  {
    path: '',
    component: ListRepaymentUploadsComponent
  }
];

@NgModule({
  declarations: [ListRepaymentUploadsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class ListRepaymentUploadsModule { }
