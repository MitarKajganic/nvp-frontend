import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  
  searchName: string = ''
  running: boolean = false;
  stopped: boolean = false;
  discharging: boolean = false;
  dateFrom: string = ''
  dateTo: string = ''
  vacuums: any[] = []

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  searchVacuums(): void {

  }

  clearFilters(): void {

  }
}
