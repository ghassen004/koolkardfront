import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { catchError } from "rxjs/operators";
import { AuthenticationRequest } from "../models/Authentification_Request";
import { AuthenticationResponse } from "../models/Authentification_Response";
import { RegistrationRequest } from "../models/Registration_Request";

interface TokenPayload {
  sub: string;
  name: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
  // Add other claims you expect
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userPayload: TokenPayload | null = null;
  private jwtHelper: JwtHelperService = new JwtHelperService();
  private baseUrl: string = 'http://localhost:8081/auth';

  private fullName$ = new BehaviorSubject<string>("");
  private email$ = new BehaviorSubject<string>("");
  private role$ = new BehaviorSubject<string>("");
  private user$ = new BehaviorSubject<any | null>(null);

  constructor(private http: HttpClient) {
    this.initializeFromToken();
  }

  private initializeFromToken() {
    const token = this.getToken();
    if (token) {
      try {
        this.setUserFromToken(token);
      } catch (error) {
        console.error('Error initializing from token:', error);
        this.logout();
      }
    }
  }

  login(authRequest: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/signin`, authRequest)
      .pipe(
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => new Error('Login failed, please try again.'));
        })
      );
  }

  signUp(registrationRequest: RegistrationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/signup`, registrationRequest)
      .pipe(
        catchError(error => {
          console.error('Signup error:', error);
          return throwError(() => new Error('Signup failed, please try again.'));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userPayload = null;
    this.user$.next(null);
    this.role$.next('');
    this.fullName$.next('');
    this.email$.next('');
  }

  setUserFromToken(token: string): void {
    localStorage.setItem('token', token);
    this.userPayload = this.decodedToken();
    if (this.userPayload) {
      this.setUser(this.userPayload);
      this.setFullNameForStore(this.userPayload.name || '');
      this.setEmailForStore(this.userPayload.email || '');
      this.setRoleForStore(this.userPayload.role || '');
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  decodedToken(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;
    return this.jwtHelper.decodeToken(token);
  }

  createAuthorizationHeader(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // Observable getters
  getUser(): Observable<any> { return this.user$.asObservable(); }
  getRoleFromStore(): Observable<string> { return this.role$.asObservable(); }
  getFullNameFromStore(): Observable<string> { return this.fullName$.asObservable(); }
  getEmailFromStore(): Observable<string> { return this.email$.asObservable(); }

  // Setters
  setUser(user: any): void { this.user$.next(user); }
  setRoleForStore(role: string): void { this.role$.next(role); }
  setFullNameForStore(name: string): void { this.fullName$.next(name); }
  setEmailForStore(email: string): void { this.email$.next(email); }

  getLoggedUser(): TokenPayload | null {
    return this.userPayload;
  }
}
