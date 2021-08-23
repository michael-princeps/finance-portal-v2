import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../core/services/project.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  pageSize = 20;
  searchText = '';
  dashboard: any;
  constructor(private service: ProjectService) { }

  ngOnInit(): void {
    this.fetchDashboard();
  }

  fetchDashboard() {
    const pageData = {
      page_size: this.pageSize,
      search_text: this.searchText,
    };
    this.service.fetchDashboard(pageData).subscribe((data: any) => {
      if (data.status === 'success') {
        this.dashboard = data.data;
      }
    });
  }
}
