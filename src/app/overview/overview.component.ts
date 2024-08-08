import { Component } from '@angular/core';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
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
  unSoldPlayers:any;
  teams: any;
  constructor( public dataService: DataService){
    this.teams= localStorage.getItem('teams')?JSON.parse(localStorage.getItem('teams') || ''):''
    this.soldPlayers = this.teams?this.teams.flatMap((team:any) => team.players):[];
    this.unSoldPlayers= localStorage.getItem('unsoldPlayers')?JSON.parse(localStorage.getItem('unsoldPlayers') || ''):[]
  }

  getTeamName(teamId: number): string {
    const team = this.teams.find((t:any) => t.id === teamId);
    return team ? team.name : 'Unknown';
  }


  downloadCSV() {
    const csvData = this.unSoldPlayers.map((player:any) => ({
      ID: player.id,
      NAME: player.name,
      IMAGE: this.extractImageName(player.image),
      POSITION: player.position,
      TEAMID: '',
      BATCH: player.batch,
      POINTS: 0
    }));

    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'unsold_players.csv');
  }

  downloadExcel() {
    const excelData = this.unSoldPlayers.map((player:any) => ({
      ID: player.id,
      NAME: player.name,
      IMAGE: player.image,
      POSITION: player.position,
      TEAMID: '',
      BATCH: player.batch,
      POINTS: 0
    }));
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'unsold_players.xlsx');
  }

  convertToCSV(data: any[]): string {
    const array = [Object.keys(data[0])].concat(data);
    return array.map(it => {
      return Object.values(it).toString();
    }).join('\n');
  }

  extractImageName(url: string): string {
    return url.split('/').pop() || ''; // Get the last part of the URL
  }
}
