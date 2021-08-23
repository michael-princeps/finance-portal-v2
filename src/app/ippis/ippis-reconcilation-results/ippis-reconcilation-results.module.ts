import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IppisReconcilationResultsComponent } from './ippis-reconcilation-results.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const route: Routes = [
  {
    path: '',
    component: IppisReconcilationResultsComponent
  }
];

@NgModule({
  declarations: [IppisReconcilationResultsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class IppisReconcilationResultsModule { }
