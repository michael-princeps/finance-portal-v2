import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllPenaltyComponent } from './all-penalty.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const route: Routes = [
  {
    path: '',
    component: AllPenaltyComponent
  }
];

@NgModule({
  declarations: [AllPenaltyComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class AllPenaltyModule { }
