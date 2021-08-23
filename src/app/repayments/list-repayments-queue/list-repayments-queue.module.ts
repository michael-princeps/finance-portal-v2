import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListRepaymentsQueueComponent } from './list-repayments-queue.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const route: Routes = [
  {
    path: '',
    component: ListRepaymentsQueueComponent
  }
];

@NgModule({
  declarations: [ListRepaymentsQueueComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class ListRepaymentsQueueModule { }
