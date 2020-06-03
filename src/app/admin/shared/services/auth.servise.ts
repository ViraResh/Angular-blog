import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FbAuthResponce, User } from '../../../shared/interfaces';
import {Observable, Subject, throwError} from 'rxjs/index';
import { environment } from '../../../../environments/environment';
import { catchError, tap } from 'rxjs/internal/operators';

@Injectable({providedIn: 'root'})
export class AuthService {
  public error$: Subject<string> = new Subject<string>();
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
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      );
  }

  logout() {
    this.setToken(null);
  }

  isAuthehticated(): boolean {
    return !!this.token;
  }

  private handleError(error: HttpErrorResponse) {
    const {message} = error.error.error;

    switch (message) {
      case 'INVALID_EMAIL':
        this.error$.next('Некоректний email');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Некоректний пароль');
        break;
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Такої пошти не існує');
        break;
    }

    console.log(message);

    return throwError(error);
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
