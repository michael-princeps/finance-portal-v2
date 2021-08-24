import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListInvestmentsComponent } from './list-investments.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const route: Routes = [
  {
    path: '',
    component: ListInvestmentsComponent
  }
];

@NgModule({
  declarations: [ListInvestmentsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class ListInvestmentsModule { }
