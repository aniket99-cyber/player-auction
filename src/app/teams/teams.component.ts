import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TeamDialogComponent } from '../team-dialog/team-dialog.component';
import { DataService } from './../data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent {
  teams: any = [];

  // State to control which input is open
  showInputIndex: number | null = null;
  inputType: 'add' | 'subtract' | null = null;
  amountInput: number = 0;

  constructor(
    public dataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object,
    public dialog: MatDialog
  ) {
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
      this.initializeRemainingAmounts();
    }
  }

  initializeRemainingAmounts(): void {
  this.teams.forEach((team: any) => {
    const totalSpent = this.calculateTotalPoints(team.id);
    const bonus = team.manualBonus || 0;

    team.remainingAmount = 10000 - totalSpent + bonus;
  });

  this.saveTeamsToStorage();
}

  calculateTotalPoints(teamId: number): number {
    let totalPoints = 0;
    const team = this.teams.find((team: any) => team.id === teamId);

    if (team && team.players) {
      totalPoints = team.players.reduce((sum: any, player: any) => sum + (player.points || 0), 0);
    }

    return totalPoints;
  }

  openTeamDialog(team: any) {
    this.dialog.open(TeamDialogComponent, {
      data: team,
      height: '100%',
      width: '55%',
    });
  }

  showInputField(index: number, type: 'add' | 'subtract') {
    this.showInputIndex = index;
    this.inputType = type;
    this.amountInput = 0;
  }

  updateAmount(index: number) {
    this.showInputIndex=-1
  if (this.amountInput <= 0) return;

  const team = this.teams[index];
  if (!team.manualBonus) team.manualBonus = 0;

  if (this.inputType === 'add') {
    team.manualBonus += this.amountInput;
    team.manualHistory.push("+"+this.amountInput.toString())
  } else if (this.inputType === 'subtract') {
    team.manualBonus -= this.amountInput;
    team.manualHistory.push("-"+this.amountInput.toString())
    console.log(team, "hello");

  }

  this.initializeRemainingAmounts(); // recalculate with bonus
  this.saveTeamsToStorage();         // persist change
}

  saveTeamsToStorage() {
    localStorage.setItem('teams', JSON.stringify(this.teams));
  }
}
