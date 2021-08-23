import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IppisReceivedComponent } from './ippis-received.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const route: Routes = [
  {
    path: '',
    component: IppisReceivedComponent
  }
];

@NgModule({
  declarations: [IppisReceivedComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class IppisReceivedModule { }
