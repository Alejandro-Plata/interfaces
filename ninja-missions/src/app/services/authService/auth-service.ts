import { JsonPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

interface UserResponse {
  token: string,
  user: User
}

interface User {
  id: string,
  username: string, 
  rank: string,
  experiencePoints: number,
  avatarUrl: string
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user'
  private readonly URL_BASE = 'https://pr3-lista-misiones-konoha-backend.vercel.app/'

  constructor() { }

  async setPreferences(user: UserResponse): Promise<void> {
    await Preferences.set({
      key: this.TOKEN_KEY,
      value: user.token
    });

    await Preferences.set({
      key: this.USER_KEY,
      value: JSON.stringify(user.user)
    });
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  async login(username: string, password: string): Promise<void> {
  
    const response = await fetch(`${this.URL_BASE}auth/login`, {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });

    const user = await response.json();

    if(!response.ok) {
      throw new Error(user.message);
    }

    this.setPreferences(user);

    }

    async register(username: string, password: string): Promise<void> {
  
    const response = await fetch(`${this.URL_BASE}auth/register`, {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });

    const user = await response.json();

    if(!response.ok) {
      throw new Error(user.message);
    }

    this.setPreferences(user);

    }

  isLoggedIn(): boolean {
    // !this.getToken() -> devuelve true si el token no existe; !(!this.getToken()) devuelve true si el token existe
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }


}
