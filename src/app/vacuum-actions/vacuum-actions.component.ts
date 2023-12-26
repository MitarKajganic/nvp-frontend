import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import axios from '../../axios'; 

@Component({
  selector: 'app-vacuum-actions',
  templateUrl: './vacuum-actions.component.html',
  styleUrls: ['./vacuum-actions.component.css']
})
export class VacuumActionsComponent implements OnInit {
  vacuum: any;
  canStartVacuum: boolean = false;
  canStopVacuum: boolean = false;
  canDischargeVacuum: boolean = false;
  actionDate: string = '';
  actionTime: string = '';

  constructor(
    public dialogRef: MatDialogRef<VacuumActionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.vacuum = data.vacuum;
      this.canStartVacuum = data.canStartVacuum;
      this.canStopVacuum = data.canStopVacuum;
      this.canDischargeVacuum = data.canDischargeVacuum;
  }

  ngOnInit(): void {
    // Additional initialization if necessary
  }

  performAction(actionType: string): void {
    const actionDateTime = `${this.actionDate}T${this.actionTime}`;
    let apiUrl = '';
    switch (actionType) {
      case 'START':
        apiUrl = `/vacuums/START/${this.vacuum.id}`;
        break;
      case 'STOP':
        apiUrl = `/vacuums/STOP/${this.vacuum.id}`;
        break;
      case 'DISCHARGE':
        apiUrl = `/vacuums/DISCHARGE/${this.vacuum.id}`;
        break;
    }

    axios.post(apiUrl, { actionDate: this.actionDate })
      .then(response => {
        console.log('Action successful:', response);
        this.dialogRef.close();
      })
      .catch(error => {
        console.error('Error performing action:', error);
      });
  }

  onTimeChange(newTime: string): void {
    this.actionTime = newTime;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
