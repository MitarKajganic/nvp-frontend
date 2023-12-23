import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  canActivate(routeData: any): boolean {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      return false;
    }

    try {
      const decoded = jwtDecode(jwt) as any;
      return decoded.permissions.includes(routeData.expectedPermission);
    } catch (error) {
      console.error('Error decoding JWT', error);
      return false;
    }
  }
}
