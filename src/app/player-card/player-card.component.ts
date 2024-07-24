import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-winner-dialog',
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.scss',
  standalone: true,
  imports: [CommonModule, MatButtonModule,MatCardModule, MatSelectModule],
})
export class PlayerCardComponent {
  constructor(
    public dialogRef: MatDialogRef<PlayerCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(this.data);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSold(): void {
    this.dialogRef.close('sold');
  }

  onUnsold(): void {
    this.dialogRef.close('unsold');
  }
}

