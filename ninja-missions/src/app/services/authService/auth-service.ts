import { Injectable } from '@angular/core';
import { AuthResponse, NinjaProfile } from 'src/app/types/types';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { API_URL } from 'src/app/utils/consts';
import { removePreferences } from 'src/app/utils/removePreferences';
import { saveNinjaData } from 'src/app/utils/setPreferences';
import { getToken } from 'src/app/utils/getPreferences';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly URL = API_URL;

  static token: string | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.initializeToken();
  }

  async initializeToken(): Promise<void> {
    const token = await getToken();
    if (token) {
      AuthService.token = token;
    }
  }

  async login(username: string, password: string): Promise<void | string> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(
          `${this.URL}/auth/login`,
          { username, password },
          { observe: 'response' }
        )
      );

      if (response.status === 200 && response.body) {
        AuthService.token = response.body.token;
        await saveNinjaData(response.body);
      } else {
        return response.body?.message;
      }

    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  async register(username: string, password: string, rank?: string): Promise<void | string> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(
          `${this.URL}/auth/register`,
          { username, password, rank },
          { observe: 'response' }
        )
      );

      if (response.status === 201 && response.body) {
        AuthService.token = response.body.token;
        await saveNinjaData(response.body);
      } else {
        return response.body?.message;
      }

    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    AuthService.token = null;
    await removePreferences();
    this.router.navigate(['/login']);
  }

  getProfile(): Observable<NinjaProfile> {
    return this.http.get<NinjaProfile>(`${this.URL}/ninjas/me/stats`);
  }

}
