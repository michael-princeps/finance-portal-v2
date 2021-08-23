import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleRefundComponent } from './single-refund.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const route: Routes = [
  {
    path: '',
    component: SingleRefundComponent
  }
];

@NgModule({
  declarations: [SingleRefundComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class SingleRefundModule { }
