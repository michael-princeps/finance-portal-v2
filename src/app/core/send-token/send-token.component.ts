import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-send-token',
  templateUrl: './send-token.component.html',
  styleUrls: ['./send-token.component.scss']
})
export class SendTokenComponent implements OnInit, AfterViewInit {
  @ViewChild('iframe') iframe: any;
  constructor(private router: Router, private title: Title, private authservice: AuthService) {
    this.title.setTitle('Validating Token...');
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.iframe.nativeElement.addEventListener('load', this.onLoad.bind(this));
  }

  onLoad: any = (event: any) => {
    const token = this.authservice.getToken();
    const user = this.authservice.getUser();
    const loggedUser = {
      token: token ? token : null,
      user: user ? JSON.parse(user) : null
    };
    try {
      this.iframe.nativeElement.contentWindow.postMessage({ userdetails: loggedUser }, '*');
      setTimeout(() => {
        // window.location.replace('home');
      }, 500);
    } catch (error) {
      console.log(error);
    }
  }
}
