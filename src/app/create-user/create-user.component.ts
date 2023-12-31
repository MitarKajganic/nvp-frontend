import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import axios from '../../axios';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
  firstName: string = ''
  lastName: string = ''
  email: string = ''
  password: string = ''
  selectedPermissions: string[] = []
  permissions: string[] = [
    'can_create_users',
    'can_read_users',
    'can_update_users',
    'can_delete_users',
    'can_search_vacuum',
    'can_start_vacuum',
    'can_stop_vacuum',
    'can_discharge_vacuum',
    'can_add_vacuum',
    'can_remove_vacuum'
  ];
  successMessage: string = ''
  errorMessage: string = ''

  constructor(private router: Router) { }

  createUser(): void {
    this.firstName = this.firstName.trim()
    this.lastName = this.lastName.trim()
    this.email = this.email.trim()
    if (this.password.includes(' ')) {
      alert('Password cannot contain spaces')
      return;
    }

    let params = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      passwordHash: this.password,
      permissions: this.selectedPermissions
    }

    axios.post('/users', params)
      .then(response => {
        this.successMessage = 'User created successfully, redirecting...';
        setTimeout(() => this.router.navigate(['/users']), 1500);
      }).catch(error => {
        this.errorMessage = 'An error occurred while creating user';
      })
  }

  navigateBack(): void {
    this.router.navigate(['/users']);
  }
}
