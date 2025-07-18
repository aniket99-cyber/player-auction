import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Ensure the service is provided at the root level
})

export class DataService {
  private _defaultOpts: any[] = [];

  teams: any[] = [
    {
      id:1,
      name: 'ROARING LIONS',
      logo: '../assets/Circle-Cut/ROARING LIONS.png',
      captain: {},
      players:[],
      owners: {},
      remainingAmount: 0,
      manualBonus: 0,
      manualHistory:[],
    },
    {
      id:2,
      name: 'DEMOLISHING EXTREMISTS',
      logo: '../assets/Circle-Cut/DEMOLISHING EXTREMISTS.png',
      captain: {},
      players:[],
      owners: {},
      remainingAmount: 0,
      manualBonus: 0,
      manualHistory:[],
    },
    {
      id:3,
      name: 'GLADIATORS',
      logo: '../assets/Circle-Cut/GLADIATORS.png',
      captain: {},
      players:[],
      owners: {},
      remainingAmount: 0,
      manualBonus: 0,
      manualHistory:[],
    },
    {
      id:4,
      name: 'NAUTICAL NINJAS',
      logo: '../assets/Circle-Cut/NAUTICAL NINJAS.png',
      captain: {},
      players:[],
      owners: {},
      remainingAmount: 0,
      manualBonus: 0,
      manualHistory:[],
    },
    {
      id:5,
      name: 'POWER PHEONIX',
      logo: '../assets/Circle-Cut/POWERPHOENIX.png',
      captain: {},
      players:[],
      owners: {},
      remainingAmount: 0,
      manualBonus: 0,
      manualHistory:[],
    },
    {
      id:6,
      name: 'PROWLING PANTHERS',
      logo: '../assets/Circle-Cut/PROWLING PANTHERS.png',
      captain: {},
      players:[],
      owners: {},
      remainingAmount: 0,
      manualBonus: 0,
      manualHistory:[],
    },
    {
      id:7,
      name: 'SHARK BOYS',
      logo: '../assets/Circle-Cut/SHARK BOYS.png',
      captain: {},
      players:[],
      owners: {},
      remainingAmount: 0,
      manualBonus: 0,
      manualHistory:[],
    },
    {
      id:8,
      name: 'TITANS',
      logo: '../assets/Circle-Cut/TITANS.png',
      captain: {},
      players:[],
      owners: {},
      remainingAmount: 0,
      manualBonus: 0,
      manualHistory:[],
    }
  ]

  owners:any[] = [
    {id:1, name:"Avipsa",image: '../assets/OWNERS/avipsa.jpeg'},
    {id:2, name:"Mahie",image: '../assets/OWNERS/mahie.jpeg'},
    {id:3, name:"Remosmita",image: '../assets/OWNERS/remosmita.jpeg'},
    {id:4, name:"Riddhi",image: '../assets/OWNERS/riddhi.jpeg'},
    {id:5, name:"Shivangi",image: '../assets/OWNERS/shivangi.jpeg'},
    {id:6, name:"Snigdha",image: '../assets/OWNERS/snigdha.jpeg'},
    {id:7, name:"Tisha",image: '../assets/OWNERS/tisha.jpeg'},
    {id:8, name:"Trishnika",image: '../assets/OWNERS/trishnika.jpeg'}
  ]

  public optionSource = new BehaviorSubject<any[]>(this.getOptions());
  option$ = this.optionSource.asObservable();

  public winnersSource = new BehaviorSubject<any[]>([]);
  winner$: Observable<string[]> = this.winnersSource.asObservable();

  public UnsoldSource = new BehaviorSubject<any[]>([]);
  unsold$: Observable<any[]> = this.UnsoldSource.asObservable();

  public unsoldPlayers:any=[]

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const storedTeams = localStorage.getItem('teams');
      let teams = [];

      if (storedTeams) {
        try {
          teams = JSON.parse(storedTeams);
        } catch (error) {
          console.error('Error parsing JSON from localStorage:', error);
          teams = [];
        }
      }

      this.teams = teams.length > 0 ? teams : this.teams;
    }
  }

  addNewOption(value: string): void {
    const currentOpts = [...this.optionSource.getValue(), value];
    this.optionSource.next(currentOpts);
    this.persistOptions();
  }

  deleteOption(value: any): void {
    const currentOpts:any = this.optionSource.getValue().filter(opt => opt.id !== value.id);
    this.optionSource.next(currentOpts);
    this.persistOptions();
  }

 addWinner(value: any): void {
  const storedTeams = localStorage.getItem('teams');
  this.teams = storedTeams ? JSON.parse(storedTeams) : [];
  console.log(this.teams);

  this.teams.forEach(team => {
    if (team.id === Number(value.value.team)) {
      // Add player
      team.players.push(value.value);

      // Ensure manualBonus is initialized
      team.manualBonus = team.manualBonus || 0;

      // Calculate total spent
      const totalSpent = team.players.reduce((sum: number, p: any) => sum + (p.points || 0), 0);

      // Correctly calculate remainingAmount with manualBonus
      team.remainingAmount = 10000 - totalSpent + team.manualBonus;
    }
  });

  console.log(this.teams);
  localStorage.setItem('teams', JSON.stringify(this.teams));
  }

  addUnsold(value: any): void {
    this.unsoldPlayers.push(value)
    console.log(this.UnsoldSource.getValue());
    localStorage.setItem('unsoldPlayers', JSON.stringify(this.unsoldPlayers))
  }

  restartWinners(): void {
    this.winnersSource.next([]);
  }

  private persistOptions(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('OPTS', JSON.stringify(this.optionSource.getValue()));
    }
  }

  private getOptions(): any[] {
    if (isPlatformBrowser(this.platformId)) {
      const value:any = localStorage.getItem('OPTS');
      console.log(value);
      return JSON.parse(value)?.length>0 ? JSON.parse(value) : this._defaultOpts;
    } else {
      return this._defaultOpts;  // Fallback in case of SSR
    }
  }

  resetToDefault(): void {
    this.optionSource.next(this._defaultOpts);
    this.persistOptions();  // Ensure default options are also persisted
  }

  updateDefaultOptions(newOptions: any[]): void {
    this._defaultOpts = newOptions;
    this.optionSource.next(newOptions);  // Update the BehaviorSubject
    this.persistOptions();  // Persist the new options in local storage
  }

  updateTeams(updatedTeams: any[]): void {
  this.teams = updatedTeams;
  localStorage.setItem('teams', JSON.stringify(this.teams));
}
}
