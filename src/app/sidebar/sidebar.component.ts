import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink, RouterModule } from '@angular/router';
import { DataService } from '../data.service';
import { ImportPlayersComponent } from '../import-players/import-players.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(public dialog: MatDialog, public dataService: DataService) {}

  openImportDialog(): void {
    const dialogRef = this.dialog.open(ImportPlayersComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataService.updateDefaultOptions(result);
      }
    });
  }
}
