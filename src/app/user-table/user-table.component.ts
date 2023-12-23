import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import axios from '../../axios';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  permissions: string[];
}

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit {
  create: boolean = false
  read: boolean = false
  update: boolean = false
  delete: boolean = false
  users: User[] = []

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.checkPermissionsAndFetchUsers();
  }

  private checkPermissionsAndFetchUsers(): void {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      alert('No JWT found in local storage');
      return;
    }

    try {
      const decoded = jwtDecode(jwt) as any;
      this.setPermissions(decoded.permissions);
      if (this.read) {
        this.fetchUsers();
      }
    } catch (error) {
      console.error('Error decoding JWT', error);
    }
  }

  private setPermissions(permissions: string[]): void {
    this.create = permissions.includes('can_create_users');
    this.read = permissions.includes('can_read_users');
    this.update = permissions.includes('can_update_users');
    this.delete = permissions.includes('can_delete_users');
  }

  private fetchUsers(): void {
    axios.get("/users/all")
      .then(response => {
        this.users = response.data as User[];
      })
      .catch(error => {
        console.error('Error fetching users', error);
      });
  }

  deleteUser(userId: number, event: MouseEvent): void {
    axios.delete(`/users/${userId}`)
      .then(response => {
        this.users = this.users.filter(user => user.id !== userId);
      })
      .catch(error => {
        alert('Error occurred when attempting to delete user')
      });
  }
  

  navigateToUpdate(userId: number): void {
    this.router.navigate(['/update', userId]);
  }

  navigateToCreate(): void {
    this.router.navigate(['/create'])
  }

  logout(): void {
    localStorage.removeItem('jwt')
    this.router.navigate(['/'])
  }
}
