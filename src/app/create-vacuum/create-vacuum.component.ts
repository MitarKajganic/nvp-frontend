import { Component } from '@angular/core';
import axios from '../../axios'
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-vacuum',
  templateUrl: './create-vacuum.component.html',
  styleUrls: ['./create-vacuum.component.css']
})
export class CreateVacuumComponent {
  name: string = ''
  successMessage: string = ''
  errorMessage: string = ''

  constructor(private router: Router) { }

  createVacuum(): void {
    if (this.name === '') {
      alert('Name cant be empty')
      return
    }

    let body = {
      name: this.name
    }

    axios.post(`/vacuums`, body)
    .then(response => {
      this.successMessage = 'Vacuum created successfully, redirecting...';
      setTimeout(() => this.router.navigate(['/search']), 1500);
    }).catch(error => {
      this.errorMessage = 'An error occurred while creating vacuum';
    })
  }
}
