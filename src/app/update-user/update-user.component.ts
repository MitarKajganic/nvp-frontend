import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import axios from '../../axios';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  userId: number | undefined
  firstName: string = ''
  lastName: string = ''
  email: string = ''
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
  ]
  selectedPermissions: string [] = []
  successMessage: string = ''
  errorMessage: string = ''

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('userId');
      if (id !== null) {
        this.userId = +id;
        this.prefillData()
      } else {
        alert('No userId provided in the route, redirecting...');
        setTimeout(() => this.router.navigate(['/table']), 2000);
      }
    });
  }

  private prefillData(): void {
    axios.get(`/users/${this.userId}`)
    .then(response => {
      const userData = response.data
      this.firstName = userData.firstName
      this.lastName = userData.lastName
      this.email = userData.email
      this.selectedPermissions = userData.permissions
    }).catch(error => {
      alert('Failed to fetch user data, redirecting...');
      setTimeout(() => this.router.navigate(['/users']), 2000);
    })
  }

  updateUser(): void { 
    let params = {
      id: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      permissions: this.selectedPermissions
    }

    axios.put(`/users`, params)
    .then(response => {
      this.successMessage = 'User created successfully, redirecting...';
      setTimeout(() => this.router.navigate(['/users']), 2000);
    }).catch(error => {
      this.errorMessage = 'An error occurred while updating user.';
    })
  }

  navigateBack(): void {
    this.router.navigate(['/users']);
  }
}
