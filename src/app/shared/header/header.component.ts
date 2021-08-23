import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() user: any;
  currentDate = new Date().toDateString();
  timeOfDay = new Date().getHours();
  constructor(private authservice: AuthService) {
  }

  ngOnInit(): void {
  }

  logUserOut() {
    this.authservice.logOut().then(() =>
      location.replace('https://intranet.creditwallet.ng/logout')
    );
  }

  getTimeOfDay() {
    if (this.timeOfDay < 12) {
      return 'Good Morning';
    } else if (this.timeOfDay >= 12 && this.timeOfDay <= 17) {
      return 'Good Afternoon';
    } else if (this.timeOfDay >= 17 && this.timeOfDay <= 24) {
      return 'Good Evening';
    } else {
      return 'Good Day';
    }
  }
}
