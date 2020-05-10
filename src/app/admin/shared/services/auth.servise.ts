import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FbAuthResponce, User } from '../../../shared/interfaces';
import { Observable } from 'rxjs/index';
import { environment } from '../../../../environments/environment';
import { tap } from 'rxjs/internal/operators';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  get token(): string {
    const expDate = new Date(localStorage.getItem('fb-token-exp'));
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem('fb-token');
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken)
      );
  }

  logout() {
    this.setToken(null);
  }

  isAuthehticated(): boolean {
    return !!this.token;
  }

  private setToken(responce: FbAuthResponce | null) {
    if (responce) {
      const expData = new Date(new Date().getTime() + +responce.expiresIn * 1000);
      localStorage.setItem('fb-token', responce.idToken);
      localStorage.setItem('fb-token-exp', expData.toString());
    } else {
      localStorage.clear();
    }
  }
}
