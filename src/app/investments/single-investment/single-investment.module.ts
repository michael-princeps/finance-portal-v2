import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInvestmentComponent } from './single-investment.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const route: Routes = [
  {
    path: '',
    component: SingleInvestmentComponent
  }
]

@NgModule({
  declarations: [SingleInvestmentComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class SingleInvestmentModule { }
