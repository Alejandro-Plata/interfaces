import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private readonly TOKEN_KEY = 'token';
  private readonly URL_BASE = 'https://pr3-lista-misiones-konoha-backend.vercel.app/'

  constructor() { }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  async login(username: string, password: string): Promise<void> {
  
    const response = await fetch(`${this.URL_BASE}auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

    const user = await response.json();

    if(!response.ok) {
      throw new Error(user.message);
    }

    this.setToken(user.token);

    }

    async register(username: string, password: string): Promise<void> {
  
    const response = await fetch(`${this.URL_BASE}auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

    const user = await response.json();

    if(!response.ok) {
      throw new Error(user.message);
    }

    this.setToken(user.token);

    }

  isLoggedIn(): boolean {
    // !this.getToken() -> devuelve true si el token no existe; !(!this.getToken()) devuelve true si el token existe
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }


}
