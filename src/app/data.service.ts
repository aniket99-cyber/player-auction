import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Ensure the service is provided at the root level
})
export class DataService {
  private _defaultOpts: any[] = [
    { name: 'Lionel Messi', age: 35, position: 'Striker', additionalInfo: 'Loves hiking', image:'messi.png'  },
    { name: 'Cristiano Ronaldo', age: 38, position: 'Striker', additionalInfo: 'Enjoys painting', image:'ronaldo.png' },
    { name: 'Neymar', age: 32, position: 'Striker', additionalInfo: 'Avid reader', image:'neymar.png' },
    { name: 'Robert Lewandowski', age: 35, position: 'Striker', additionalInfo: 'Gourmet chef', image:'lewandoski.png' },
    { name: 'Kylian Mbappé', age: 24, position: 'Striker', additionalInfo: 'Plays guitar', image:'mbappe.png' },
    { name: 'Kevin De Bruyne', age: 30, position: 'Mid-fielder', additionalInfo: 'Yoga enthusiast', image:'debrunye.png' },
    { name: 'Virgil van Dijk', age: 30, position: 'Defender', additionalInfo: 'Diverse interests', image:'van-dik.png' },
    { name: 'Lionel Messi', age: 35, position: 'Striker', additionalInfo: 'Loves hiking', image:'messi.png'  },
    { name: 'Cristiano Ronaldo', age: 38, position: 'Striker', additionalInfo: 'Enjoys painting', image:'ronaldo.png' },
    { name: 'Neymar', age: 32, position: 'Striker', additionalInfo: 'Avid reader', image:'neymar.png' },
    { name: 'Robert Lewandowski', age: 35, position: 'Striker', additionalInfo: 'Gourmet chef', image:'lewandoski.png' },
    { name: 'Kylian Mbappé', age: 24, position: 'Striker', additionalInfo: 'Plays guitar', image:'mbappe.png' },
    { name: 'Kevin De Bruyne', age: 30, position: 'Mid-fielder', additionalInfo: 'Yoga enthusiast', image:'debrunye.png' },
    { name: 'Virgil van Dijk', age: 30, position: 'Defender', additionalInfo: 'Diverse interests', image:'van-dik.png' },
    { name: 'Lionel Messi', age: 35, position: 'Striker', additionalInfo: 'Loves hiking', image:'messi.png'  },
    { name: 'Cristiano Ronaldo', age: 38, position: 'Striker', additionalInfo: 'Enjoys painting', image:'ronaldo.png' },
    { name: 'Neymar', age: 32, position: 'Striker', additionalInfo: 'Avid reader', image:'neymar.png' },
    { name: 'Robert Lewandowski', age: 35, position: 'Striker', additionalInfo: 'Gourmet chef', image:'lewandoski.png' },
    { name: 'Kylian Mbappé', age: 24, position: 'Striker', additionalInfo: 'Plays guitar', image:'mbappe.png' },
    { name: 'Kevin De Bruyne', age: 30, position: 'Mid-fielder', additionalInfo: 'Yoga enthusiast', image:'debrunye.png' },
    { name: 'Virgil van Dijk', age: 30, position: 'Defender', additionalInfo: 'Diverse interests', image:'van-dik.png' },
    { name: 'Lionel Messi', age: 35, position: 'Striker', additionalInfo: 'Loves hiking', image:'messi.png'  },
    { name: 'Cristiano Ronaldo', age: 38, position: 'Striker', additionalInfo: 'Enjoys painting', image:'ronaldo.png' },
    { name: 'Neymar', age: 32, position: 'Striker', additionalInfo: 'Avid reader', image:'neymar.png' },
    { name: 'Robert Lewandowski', age: 35, position: 'Striker', additionalInfo: 'Gourmet chef', image:'lewandoski.png' },
    { name: 'Kylian Mbappé', age: 24, position: 'Striker', additionalInfo: 'Plays guitar', image:'mbappe.png' },
    { name: 'Kevin De Bruyne', age: 30, position: 'Mid-fielder', additionalInfo: 'Yoga enthusiast', image:'debrunye.png' },
    { name: 'Virgil van Dijk', age: 30, position: 'Defender', additionalInfo: 'Diverse interests', image:'van-dik.png' },
    { name: 'Lionel Messi', age: 35, position: 'Striker', additionalInfo: 'Loves hiking', image:'messi.png'  },
    { name: 'Cristiano Ronaldo', age: 38, position: 'Striker', additionalInfo: 'Enjoys painting', image:'ronaldo.png' },
    { name: 'Neymar', age: 32, position: 'Striker', additionalInfo: 'Avid reader', image:'neymar.png' },
    { name: 'Robert Lewandowski', age: 35, position: 'Striker', additionalInfo: 'Gourmet chef', image:'lewandoski.png' },
    { name: 'Kylian Mbappé', age: 24, position: 'Striker', additionalInfo: 'Plays guitar', image:'mbappe.png' },
    { name: 'Kevin De Bruyne', age: 30, position: 'Mid-fielder', additionalInfo: 'Yoga enthusiast', image:'debrunye.png' },
    { name: 'Virgil van Dijk', age: 30, position: 'Defender', additionalInfo: 'Diverse interests', image:'van-dik.png' },
    { name: 'Lionel Messi', age: 35, position: 'Striker', additionalInfo: 'Loves hiking', image:'messi.png'  },
    { name: 'Cristiano Ronaldo', age: 38, position: 'Striker', additionalInfo: 'Enjoys painting', image:'ronaldo.png' },
    { name: 'Neymar', age: 32, position: 'Striker', additionalInfo: 'Avid reader', image:'neymar.png' },
    { name: 'Robert Lewandowski', age: 35, position: 'Striker', additionalInfo: 'Gourmet chef', image:'lewandoski.png' },
    { name: 'Kylian Mbappé', age: 24, position: 'Striker', additionalInfo: 'Plays guitar', image:'mbappe.png' },
    { name: 'Kevin De Bruyne', age: 30, position: 'Mid-fielder', additionalInfo: 'Yoga enthusiast', image:'debrunye.png' },
  ];

  private optionSource = new BehaviorSubject<any[]>(this.getOptions());
  option$ = this.optionSource.asObservable();

  private winnersSource = new BehaviorSubject<any[]>([]);
  winner$: Observable<string[]> = this.winnersSource.asObservable();

  private UnsoldSource = new BehaviorSubject<any[]>([]);
  unsold$: Observable<any[]> = this.UnsoldSource.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  addNewOption(value: string): void {
    const currentOpts = [...this.optionSource.getValue(), value];
    this.optionSource.next(currentOpts);
    this.persistOptions();
  }

  deleteOption(value: string): void {
    const currentOpts = this.optionSource.getValue().filter(opt => opt !== value);
    this.optionSource.next(currentOpts);
    this.persistOptions();
  }

  addWinner(value: any): void {
    const winners = [...this.winnersSource.getValue(), value];
    this.winnersSource.next(winners);
  }

  addUnsold(value: any): void {
    const unsold = [...this.UnsoldSource.getValue(), value];
    this.UnsoldSource.next(unsold);
  }

  restartWinners(): void {
    this.winnersSource.next([]);
  }

  private persistOptions(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('OPTS', JSON.stringify(this.optionSource.getValue()));
    }
  }

  private getOptions(): string[] {
    if (isPlatformBrowser(this.platformId)) {
      const value = localStorage.getItem('OPTS');
      return value ? JSON.parse(value) : this._defaultOpts;
    } else {
      return this._defaultOpts;  // Fallback in case of SSR
    }
  }

  resetToDefault(): void {
    this.optionSource.next(this._defaultOpts);
    this.persistOptions();  // Ensure default options are also persisted
  }
}
