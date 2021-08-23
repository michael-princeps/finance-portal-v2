import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  storeToken(token: string) {
    return localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token') || null;
  }

  storeUser(user: any) {
    return localStorage.setItem('cw-user', JSON.stringify(user));
    // return this.userObject$.next(user);
  }

  getUser() {
    return localStorage.getItem('cw-user') || null;
  }

  isLoggedIn() {
    return !!this.getToken();
}

  async clearStorage() {
    await window.localStorage.removeItem('token');
    await window.localStorage.removeItem('cw-user');
    await window.localStorage.clear();
  }

  logOut() {
    return this.clearStorage();
  }
}
