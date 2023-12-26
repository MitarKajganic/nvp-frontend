import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import axios from '../../axios';

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
  canCreateVacuum: boolean = false;
  canRemoveVacuum: boolean = false;
  canStartVacuum: boolean = false;
  canStopVacuum: boolean = false;
  canDischargeVacuum: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    const jwt = localStorage.getItem('jwt');

    if (!jwt) {
      alert('No JWT found in local storage');
      return;
    }

    const decoded = jwtDecode(jwt) as any
    this.setPermissions(decoded.permissions);
    this.loadVacuums();
  }

  private setPermissions(permissions: string[]): void {
    this.canCreateVacuum = permissions.includes('can_create_users');
    this.canRemoveVacuum = permissions.includes('can_remove_users');
    this.canStartVacuum = permissions.includes('can_start_users');
    this.canStopVacuum = permissions.includes('can_stop_users');
    this.canDischargeVacuum = permissions.includes('can_discharge_users');
  }

  searchVacuums(): void {
    let params: any = {};
  
    let statusList = [];
    if (this.running) statusList.push('RUNNING');
    if (this.stopped) statusList.push('STOPPED');
    if (this.discharging) statusList.push('DISCHARGING');

    if (statusList.length > 0) params.statuses = statusList.join(',');
  
    if (this.searchName) params.name = this.searchName;
    if (this.dateFrom) params.dateFrom = this.dateFrom;
    if (this.dateTo) params.dateTo = this.dateTo;
  
    axios.get(`/vacuums/search`, { params })
      .then(response => {
        this.vacuums = response.data;
      })
      .catch(error => {
        console.error('Error fetching vacuums:', error);
      });
  }
  

  clearFilters(): void {
    this.searchName = ''
    this.running = false;
    this.stopped = false;
    this.discharging = false;
    this.dateFrom = ''
    this.dateTo = ''

    this.loadVacuums();
  }

  loadVacuums(): void {
    axios.get(`/vacuums/search`)
      .then(response => {
        this.vacuums = response.data
      })
      .catch(error => {
        console.error('Error fetching vacuums:', error);
      });
  }

  navigateToCreateVacuum(): void {
    this.router.navigate(['/create-vacuum'])
  }
}
