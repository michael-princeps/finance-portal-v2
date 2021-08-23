import { AfterViewInit, Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-receive-token',
  templateUrl: './receive-token.component.html',
  styleUrls: ['./receive-token.component.scss']
})
export class ReceiveTokenComponent implements OnInit, AfterViewInit {

  constructor(private authservice: AuthService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
     if (window.addEventListener) {
      window.addEventListener('message', this.receiveMessage.bind(this), { once: true });
    } else {
      (window as any).attachEvent('onmessage', this.receiveMessage.bind(this), { once: true });
    }
  }

  receiveMessage: any = (event: any) => {
    if (event.origin === 'https://intranet.creditwallet.ng') {
      if (event.data) {
        const princeps = event.data.userdetails;
        const logout = event.data.logout;
        if (princeps) {
          this.authservice.storeToken(princeps.token);
          this.authservice.storeUser(princeps.user);
        } else if (logout) {
          this.authservice.clearStorage();
        }
      }
    } else {
      // window.location.replace(`https://intranet.creditwallet.ng`);
    }
  }
}
