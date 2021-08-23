import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListRefundsComponent } from './list-refunds.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const route: Routes = [
  {
    path: '',
    component: ListRefundsComponent
  }
];


@NgModule({
  declarations: [ListRefundsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class ListRefundsModule { }
