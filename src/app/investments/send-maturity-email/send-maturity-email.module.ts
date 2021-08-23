import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendMaturityEmailComponent } from './send-maturity-email.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const route: Routes = [
  {
    path: '',
    component: SendMaturityEmailComponent
  }
];

@NgModule({
  declarations: [SendMaturityEmailComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class SendMaturityEmailModule { }
