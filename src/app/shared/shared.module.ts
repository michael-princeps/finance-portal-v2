import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { MonthFormaterPipe } from './pipes/month-formater.pipe';
import { PaginationComponent } from './pagination/pagination.component';


@NgModule({
  declarations: [MonthFormaterPipe, PaginationComponent],
  imports: [
    CommonModule
  ],
  exports: [
    MonthFormaterPipe,
    NzDropDownModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputNumberModule,
    NzMessageModule,
    NzGridModule,
    NzTagModule,
    NzFormModule,
    NzCardModule,
    NzAlertModule,
    NzPopconfirmModule,
    NzSkeletonModule,
    NzSelectModule,
    NzAvatarModule,
    NzNotificationModule,
    NzCheckboxModule,
    NzModalModule,
    NzCollapseModule,
    NzIconModule,
    NzTabsModule,
    NzDatePickerModule,
    NzInputModule,
    NzProgressModule
  ]
})
export class SharedModule { }
