import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../core/services/auth.service';
import { UrlService } from '../core/services/url.service';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss']
})
export class HomeLayoutComponent implements OnInit {
  user: any;
  returnUrl: string;
  constructor(private authservice: AuthService, private url: UrlService) {
    const user = authservice.getUser();
    this.user = JSON.parse(user);
  }
  
  ngOnInit(): void {
    this.returnUrl = this.url.getPreviousUrl();
  }

}
