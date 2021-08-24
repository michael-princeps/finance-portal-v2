import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolloverInvestmentComponent } from './rollover-investment.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const route: Routes = [
  {
    path: '',
    component: RolloverInvestmentComponent
  }
]

@NgModule({
  declarations: [RolloverInvestmentComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class RolloverInvestmentModule { }
