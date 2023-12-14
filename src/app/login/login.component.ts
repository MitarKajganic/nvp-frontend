import { Component } from '@angular/core';
import axios from '../../axios';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = ''
  password: string = ''
  loginError: string = ''

  login(){
    if (this.email.trim() !== '' && this.password !== '') {
        axios.post('/auth', {
          email: this.email,
          password: this.password
        }).then(response => {
          const jwt = response.data.jwt
          localStorage.setItem('jwt', jwt)

          const decoded = jwtDecode(jwt)
          console.log('Decoded JWT:', decoded)
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
