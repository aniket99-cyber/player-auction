import { Component } from '@angular/core';
import { DataService } from './../data.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  soldPlayers: any;
  teams: any;
  constructor( public dataService: DataService){
    this.teams= JSON.parse(localStorage.getItem('teams') || '')
    this.soldPlayers = this.teams.flatMap((team:any) => team.players);
  }

  getTeamName(teamId: number): string {
    const team = this.teams.find((t:any) => t.id === teamId);
    return team ? team.name : 'Unknown';
  }
}
