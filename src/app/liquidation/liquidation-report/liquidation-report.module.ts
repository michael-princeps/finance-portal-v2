import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiquidationReportComponent } from './liquidation-report.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const route: Routes = [
  {
    path: '',
    component: LiquidationReportComponent
  }
]

@NgModule({
  declarations: [LiquidationReportComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class LiquidationReportModule { }
