import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceiveTokenComponent } from './receive-token.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: ReceiveTokenComponent
  }
]

@NgModule({
  declarations: [ReceiveTokenComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ReceiveTokenModule { }
