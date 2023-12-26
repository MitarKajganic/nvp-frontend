import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { VacuumActionsComponent } from '../vacuum-actions/vacuum-actions.component';
import { MatDialog } from '@angular/material/dialog';
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
  canCreateVacuum: boolean = true;
  canRemoveVacuum: boolean = false;
  canStartVacuum: boolean = false;
  canStopVacuum: boolean = false;
  canDischargeVacuum: boolean = false;
  successMessage: string = ''
  errorMessage: string = ''

  constructor(private router: Router, private dialog: MatDialog) { }

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
    this.canCreateVacuum = permissions.includes('can_create_vacuum');
    this.canRemoveVacuum = permissions.includes('can_remove_vacuum');
    this.canStartVacuum = permissions.includes('can_start_vacuum');
    this.canStopVacuum = permissions.includes('can_stop_vacuum');
    this.canDischargeVacuum = permissions.includes('can_discharge_vacuum');
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

  removeVacuum(vacuumId: number, event: Event): void {
    event.stopPropagation();

    if (confirm("Are you sure you want to delete this vacuum?")) {
      axios.delete(`/vacuums/${vacuumId}`)
        .then(() => {
          this.loadVacuums();
          this.successMessage = 'Vacuum created successfully, redirecting...';
          setTimeout(() => this.successMessage = '', 1500);
        })
        .catch(() => {
          this.errorMessage = 'An error occurred while creating vacuum';
        });
    }
  }

  canPerformAction(): boolean {
    return this.canStartVacuum || this.canStopVacuum || this.canDischargeVacuum;
  }

  openVacuumActions(vacuum: any): void {
    const dialogRef = this.dialog.open(VacuumActionsComponent, {
      width: '700px',
      data: {
        vacuum: vacuum,
        canStartVacuum: this.canStartVacuum, 
        canStopVacuum: this.canStopVacuum,
        canDischargeVacuum: this.canDischargeVacuum
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  navigateToCreateVacuum(): void {
    this.router.navigate(['/create-vacuum'])
  }
}
