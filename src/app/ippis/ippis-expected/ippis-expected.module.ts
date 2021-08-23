import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IppisExpectedComponent } from './ippis-expected.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const route: Routes = [
  {
    path: '',
    component: IppisExpectedComponent
  }
];

@NgModule({
  declarations: [IppisExpectedComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class IppisExpectedModule { }
