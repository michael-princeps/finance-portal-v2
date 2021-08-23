import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateLiquidationComponent } from './create-liquidation.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const route: Routes = [
  {
    path: '',
    component: CreateLiquidationComponent
  }
];


@NgModule({
  declarations: [CreateLiquidationComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class CreateLiquidationModule { }
