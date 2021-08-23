import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRefundComponent } from './create-refund.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const route: Routes = [
  {
    path: '',
    component: CreateRefundComponent
  }
];

@NgModule({
  declarations: [CreateRefundComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class CreateRefundModule { }
