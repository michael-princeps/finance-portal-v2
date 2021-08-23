import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleLiquidationComponent } from './single-liquidation.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const route: Routes = [
  {
    path: '',
    component: SingleLiquidationComponent
  }
];

@NgModule({
  declarations: [SingleLiquidationComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class SingleLiquidationModule { }
