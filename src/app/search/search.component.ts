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
  running: boolean = false
  stopped: boolean = false
  discharging: boolean = false
  dateFrom: string = ''
  dateTo: string = ''
  maxDateFrom: string = '';
  maxDateTo: string = '';
  vacuums: any[] = []
  selectedVacuumId: number | null = null;
  canCreateVacuum: boolean = false
  canRemoveVacuum: boolean = false
  canStartVacuum: boolean = false
  canStopVacuum: boolean = false
  canDischargeVacuum: boolean = false
  successMessage: string = ''
  errorMessage: string = ''

  constructor(private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    const jwt = localStorage.getItem('jwt');

    if (!jwt) {
      alert('No JWT found in local storage');
      return;
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.maxDateFrom = this.formatDate(today);
    this.maxDateTo = this.formatDate(tomorrow);

    const decoded = jwtDecode(jwt) as any
    this.setPermissions(decoded.permissions);
    this.loadVacuums();
  }

  private formatDate(date: Date): string {
    const d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  private setPermissions(permissions: string[]): void {
    this.canCreateVacuum = permissions.includes('can_add_vacuum');
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
          this.successMessage = 'Vacuum deleted successfully';
          setTimeout(() => this.successMessage = '', 1500);
        })
        .catch(() => {
          this.errorMessage = 'An error occurred while deleting vacuum';
        });
    }
  }

  canPerformAction(): boolean {
    return this.canStartVacuum || this.canStopVacuum || this.canDischargeVacuum;
  }

  openVacuumActions(vacuum: any): void {
    this.selectedVacuumId = vacuum.id

    const dialogRef = this.dialog.open(VacuumActionsComponent, {
      width: '700px',
      data: {
        vacuum: vacuum,
        canStartVacuum: this.canStartVacuum, 
        canStopVacuum: this.canStopVacuum,
        canDischargeVacuum: this.canDischargeVacuum
      }
    });

    dialogRef.componentInstance.actionCompleted.subscribe((actionType: string) => {
      this.handleActionCompletion(actionType, vacuum.cycle);
    });
  }

  handleActionCompletion(actionType: string, cycleCount: number): void {
    const baseReloadTime = 20000;
  
    if (actionType === 'STOP' && cycleCount === 3) {
      this.scheduleReload(baseReloadTime);
      this.scheduleReload(baseReloadTime * 2);
      this.scheduleReload(baseReloadTime * 3);
    } else if (actionType === 'DISCHARGE') {
      this.scheduleReload(baseReloadTime);
      this.scheduleReload(baseReloadTime * 2);
    } else {
      this.scheduleReload(baseReloadTime);
    }
  }
  
  scheduleReload(delay: number): void {
    setTimeout(() => {
      this.loadVacuums();
    }, delay);
  }
  

  navigateToCreateVacuum(): void {
    this.router.navigate(['/create-vacuum'])
  }
}
