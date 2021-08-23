import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListLiquidationComponent } from './list-liquidation.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const route: Routes = [
  {
    path: '',
    component: ListLiquidationComponent
  }
]

@NgModule({
  declarations: [ListLiquidationComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class ListLiquidationModule { }
