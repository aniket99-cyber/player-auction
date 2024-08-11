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
  soldSortedPlayers:any;
  unSoldPlayers:any;
  teams: any;
  date:any= new Date();
  currentDateTime: string='';
  constructor( public dataService: DataService){
    this.teams= localStorage.getItem('teams')?JSON.parse(localStorage.getItem('teams') || ''):''
    this.soldPlayers = this.teams?this.teams.flatMap((team:any) => team.players):[];
    this.soldSortedPlayers = this.soldPlayers.sort((a:any, b:any) => b.points - a.points);
    this.unSoldPlayers= localStorage.getItem('unsoldPlayers')?JSON.parse(localStorage.getItem('unsoldPlayers') || ''):[]
    this.updateDateTime();
  }

  getTeamName(teamId: number): string {
    const team = this.teams.find((t:any) => t.id === teamId);
    return team ? team.name : 'Unknown';
  }

  updateDateTime(): void {
    const now = new Date();

    // Format the date
    const day = now.getDate();
    const weekday = now.toLocaleString('en-US', { weekday: 'short' }); // "Fri"
    const year = now.getFullYear();

    // Format the time in 12-hour format with AM/PM
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;

    // Combine date and time
    this.currentDateTime = `${day} ${weekday} ${year} ${formattedTime}`;
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


  downloadCSVSold() {
    const csvData = this.soldSortedPlayers.map((player:any) => ({
      ID: player.id,
      NAME: player.name,
      POSITION: player.position,
      TEAMID: this.getTeamName(player.team),
      BATCH: player.batch,
      POINTS: player.points
    }));

    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'sold_players.csv');
  }

  downloadExcelSold() {
    const excelData = this.soldSortedPlayers.map((player:any) => ({
      ID: player.id,
      NAME: player.name,
      POSITION: player.position,
      TEAMID: this.getTeamName(player.team),
      BATCH: player.batch,
      POINTS: player.points
    }));
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'sold_players.xlsx');
  }
}
