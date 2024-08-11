import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-team-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-dialog.component.html',
  styleUrl: './team-dialog.component.scss'
})
export class TeamDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public teamData: any) {}
  arrangedPlayers: any[] = [];

  ngOnInit(){
  console.log(this.teamData);
  this.arrangePlayersInPyramid();
  }

  arrangePlayersInPyramid(): void {
    const playersWithoutCaptain = this.teamData.players.filter((player:any) => player.name !== this.teamData.captain.name);

    const pyramidRows = [];
    let playersIndex = 0;

    const rowStructure = [2,3]; // Number of players in each row

    for (let rowCount of rowStructure) {
      const row = playersWithoutCaptain.slice(playersIndex, playersIndex + rowCount);
      pyramidRows.push(row);
      playersIndex += rowCount;
    }

    this.arrangedPlayers = pyramidRows;
  }

  getCaptainStyle() {
    return {
      width: '80px',
      height: '80px',
      marginBottom: '20px',
    };
  }

  getPlayerStyle() {
    return {
      width: '60px',
      height: '60px',
      marginBottom: '10px',
    };
  }
}
