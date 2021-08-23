import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitiatePenaltyComponent } from './initiate-penalty.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: InitiatePenaltyComponent
  }
];

@NgModule({
  declarations: [InitiatePenaltyComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class InitiatePenaltyModule { }
