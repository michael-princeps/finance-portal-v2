import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleRepaymentComponent } from './single-repayment.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const route: Routes = [
  {
    path: '',
    component: SingleRepaymentComponent
  }
];

@NgModule({
  declarations: [SingleRepaymentComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class SingleRepaymentModule { }
