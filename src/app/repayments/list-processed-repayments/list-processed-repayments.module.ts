import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListProcessedRepaymentsComponent } from './list-processed-repayments.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const route: Routes = [
  {
    path: '',
    component: ListProcessedRepaymentsComponent
  }
];

@NgModule({
  declarations: [ListProcessedRepaymentsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class ListProcessedRepaymentsModule { }
