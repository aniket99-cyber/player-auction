import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-import-players',
  standalone: true,
  imports: [],
  templateUrl: './import-players.component.html',
  styleUrl: './import-players.component.scss'
})
export class ImportPlayersComponent {
  players: any[] = [];

  constructor(public dialogRef: MatDialogRef<ImportPlayersComponent>) {}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          this.players = results.data
            .filter((row: any) => row.ID && row.NAME)
            .map((row: any) => ({
              id: Number(row.ID),
              name: row.NAME,
              position: row.POSITION || '',
              image: this.generateCloudinaryUrl(row.IMAGE) || '',
              batch: row.BATCH || '',
              team: row.TEAMID || 0,
              points: Number(row.POINTS) || 0
            }));
          console.log(this.players);
        },
        error: (error) => {
          console.error('Error parsing CSV file:', error);
        }
      });
    }
  }

  generateCloudinaryUrl(imageName: string): string {
    return `https://res.cloudinary.com/dznw7lroa/image/upload/${imageName}`;
  }

   // Utility method to extract the file name from the URL
  extractFileId(url: string): string {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : '';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  importPlayers(): void {
    this.dialogRef.close(this.players);
  }
}
