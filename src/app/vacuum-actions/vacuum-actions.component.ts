import { Component, Inject, EventEmitter, Output  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import axios from '../../axios';

@Component({
  selector: 'app-vacuum-actions',
  templateUrl: './vacuum-actions.component.html',
  styleUrls: ['./vacuum-actions.component.css']
})
export class VacuumActionsComponent {
  vacuum: any;
  canStartVacuum: boolean = false;
  canStopVacuum: boolean = false;
  canDischargeVacuum: boolean = false;
  actionDate: Date | null = null;
  actionTime: string = '';
  minDate: Date = new Date();

  @Output() actionCompleted = new EventEmitter<string>();

  constructor(
    public dialogRef: MatDialogRef<VacuumActionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.vacuum = data.vacuum;
    this.canStartVacuum = data.canStartVacuum;
    this.canStopVacuum = data.canStopVacuum;
    this.canDischargeVacuum = data.canDischargeVacuum;
  }

  performAction(actionType: string): void {
    if (this.actionDate && this.actionTime) {
      const year = this.actionDate.getFullYear();
      const month = ('0' + (this.actionDate.getMonth() + 1)).slice(-2);
      const day = ('0' + this.actionDate.getDate()).slice(-2);

      const formattedDate = `${month}/${day}/${year}`;
      this.scheduleOperation(actionType, `${formattedDate} ${this.actionTime}`)
    } else if (this.actionDate || this.actionTime) {
      if (!this.actionDate) {
        alert('actionDate is required if actionTime is selected.');
        return
      }
      if (!this.actionTime) {
        alert('actionTime is required if actionDate is selected.');
        return
      }
    } else this.executeOperation(actionType)
  }

  scheduleOperation(actionType: string, dateTime: string): void {
    if (new Date(dateTime) <= new Date()) {
      alert('Cannot schedule an operation in the past. Please select a future date and time.');
      return;
    }

    let body = {
      vacuumId: this.vacuum.id,
      action: actionType,
      scheduledDateTime: dateTime
    }

    axios.post(`/vacuums/schedule`, body)
      .catch(error => {
        console.log(error)
      })

    this.closeDialog()
  }

  executeOperation(actionType: string): void {
    axios.put(`/vacuums/${actionType}/${this.vacuum.id}`)
      .then(response => {
        if (response.status === 200) this.actionCompleted.emit(actionType);
      })
      .catch(error => {
        console.log(error);
      });

    this.closeDialog();
  }

  onTimeChange(newTime: string): void {
    this.actionTime = newTime;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
