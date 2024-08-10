import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TeamDialogComponent } from '../team-dialog/team-dialog.component';
import { DataService } from './../data.service';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent {
  teams: any = [];

  constructor(public dataService: DataService, @Inject(PLATFORM_ID) private platformId: Object, public dialog: MatDialog){
    if (isPlatformBrowser(this.platformId)) {
      let teams: any[];

      try {
        const storedTeams = localStorage.getItem('teams');
        teams = storedTeams ? JSON.parse(storedTeams) : null;
      } catch (error) {
        console.error('Error parsing JSON from localStorage:', error);
        teams = [];
      }

      this.teams = teams ? teams : this.dataService.teams;
      this.calculateTotalPointsForAllTeams()
    }
  }

  calculateTotalPointsForAllTeams(): void {
    this.teams.forEach((team:any) => {
      team.remainingAmount = 8000 - this.calculateTotalPoints(team.id);
    });
  }

  calculateTotalPoints(teamId: number): number {
    let totalPoints = 0;
    const team = this.teams.find((team:any) => team.id === teamId);

    if (team && team.players) {
      totalPoints = team.players.reduce((sum:any, player:any) => sum + (player.points || 0), 0);
    }

    return totalPoints;
  }

  openTeamDialog(team:any) {
    this.dialog.open(TeamDialogComponent, {
      data: team,
      height: '100%',
      width: '50%',
    });
  }
}
