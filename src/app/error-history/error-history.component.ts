import { Component, OnInit } from '@angular/core';
import axios from '../../axios';

@Component({
  selector: 'app-error-history',
  templateUrl: './error-history.component.html',
  styleUrls: ['./error-history.component.css']
})
export class ErrorHistoryComponent implements OnInit{
  errorMessages: any[] = []

  ngOnInit(): void {
    axios.get(`/errors`)
    .then(response => {
      this.errorMessages = response.data;
    })
    .catch(error => {
      console.error('Error fetching vacuums:', error);
    });
  }
}
