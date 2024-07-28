import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { DataService } from '../data.service';

@Component({
  selector: 'app-winner-dialog',
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.scss',
  standalone: true,
  imports: [CommonModule, MatButtonModule,MatCardModule, MatSelectModule, FormsModule],
})
export class PlayerCardComponent {
  teamId:any=0;
  points:any=0;
  constructor(
    public dialogRef: MatDialogRef<PlayerCardComponent>,
    public dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(this.data);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSold(): void {
    this.data.value.team= Number(this.teamId);
    this.data.value.points=this.points;
    console.log(this.data);

    this.dataService.addWinner(this.data);
    this.dialogRef.close('sold');
  }

  onUnsold(): void {
    this.dialogRef.close('unsold');
  }
}

