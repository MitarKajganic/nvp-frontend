import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import axios from '../../axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginError: string = '';

  constructor(private router: Router) { }

  login() {
    if (this.email.trim() !== '' && this.password !== '') {
      if (this.password.includes(' ')) {
        alert('Password cannot contain spaces')
        return;
      }

      axios.post('/auth', {
        email: this.email,
        password: this.password
      }).then(response => {
        const jwt = response.data.jwt
        const decoded = jwtDecode(jwt) as any
        localStorage.setItem('jwt', jwt)

        const permissions = decoded.permissions
        if (permissions && permissions.length > 0) {
          localStorage.setItem('jwt', jwt)
          this.router.navigate(['/table'])
        } else {
          alert('No permissions found in JWT');
        }
      }).catch(error => {
        if (error.response && error.response.status === 403) {
          this.loginError = 'Access denied. Check your credentials and try again.';
        } else {
          console.error('Login error', error);
          this.loginError = 'An error occurred during login. Please try again later.';
        }
      });
    }
  }
}
