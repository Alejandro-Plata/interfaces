import { Injectable } from '@angular/core';
import { RegisterData, LoginData } from '../types/types';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private apiUrl = 'http://localhost:3000/api'; 

  async register(data: RegisterData): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Error en el registro');
      }

      this.setUserInfo(await response.json());

      
      
    } catch (error) {
      console.error('Fallo de conexión:', error);
      throw error;
    }
  }

  async login(data: LoginData): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // <--- FALTABA ESTO
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Error en el registro');
      }

      this.setUserInfo(await response.json())
      
    } catch (error) {
      console.error('Fallo de conexión:', error);
      throw error;
    }
  }

  async setUserInfo(response: any) {
    await Preferences.set({
      key: 'token',
      value: response.token
    });
      await Preferences.set({
      key: 'user',
      value: JSON.stringify(response.user)
    });
  }

}
