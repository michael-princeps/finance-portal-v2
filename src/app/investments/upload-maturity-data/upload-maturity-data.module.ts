import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadMaturityDataComponent } from './upload-maturity-data.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const route: Routes = [
  {
    path: '',
    component: UploadMaturityDataComponent
  }
];

@NgModule({
  declarations: [UploadMaturityDataComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class UploadMaturityDataModule { }
