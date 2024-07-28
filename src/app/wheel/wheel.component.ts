import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, DoCheck, ElementRef, Inject, Input, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../data.service';
import { PlayerCardComponent } from '../player-card/player-card.component';

const COLORS = ['#f82', '#0bf', '#fb0', '#0fb', '#b0f', '#f0b', '#bf0'];

interface Sector {
  color: any;
  label: any;
}

@Component({
  selector: 'app-wheel',
  templateUrl: './wheel.component.html',
  styleUrls: ['./wheel.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule], // Import Angular Material modules
})
export class WheelComponent implements AfterViewInit, DoCheck {
  @Input() set options(values: string[]) {
    this.sectors = values.map((opts:any, i:any) => ({
      color: COLORS[i % COLORS.length],
      label: opts,
    }));

    if (this.wheel && isPlatformBrowser(this.platformId)) {
      this.createWheel();
    }
  }

  @ViewChild('wheel') wheel: ElementRef<HTMLCanvasElement> | undefined;
  @ViewChild('spin') spin: ElementRef<HTMLButtonElement> | undefined;
  sectors: Sector[] = [];

  rand = (min: number, max: number) => Math.random() * (max - min) + min;
  tot = 0;
  ctx: CanvasRenderingContext2D | undefined;
  dia = 0;
  rad = 0;
  PI = Math.PI;
  TAU = 2 * Math.PI;
  arc0 = 0;

  winners: string[] = [];
  modeDelete = true;
  friction = 0.995; // 0.995=soft, 0.99=mid, 0.98=hard
  angVel = 0; // Angular velocity
  ang = 0; // Angle in radians
  lastSelection: number | any;

  constructor(private dataService: DataService, @Inject(PLATFORM_ID) private platformId: Object, private dialog: MatDialog,) {}

  ngDoCheck(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.engine();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.createWheel();
    }
  }

  createWheel() {
    if (!isPlatformBrowser(this.platformId) || !this.wheel || !this.wheel.nativeElement.getContext) return; // Check if we're on the server

    this.ctx = this.wheel.nativeElement.getContext('2d')!;
    this.dia = this.ctx.canvas.width;
    this.tot = this.sectors.length;
    this.rad = this.dia / 2;
    this.arc0 = this.TAU / this.sectors.length;

    this.sectors.forEach((sector, i) => this.drawSector(sector, i));
    this.rotate(true);
    this.restartWinner();
  }

  spinner() {
    if (!this.angVel) this.angVel = this.rand(0.25, 0.35);
  }

  getIndex() {
    return Math.floor(this.tot - (this.ang / this.TAU) * this.tot) % this.tot;
  }

  drawSector(sector: Sector, i: number) {
    if (!this.ctx) return;

    const ang = this.arc0 * i;
    this.ctx.save();
    // COLOR
    this.ctx.beginPath();
    this.ctx.fillStyle = sector.color;
    this.ctx.moveTo(this.rad, this.rad);
    this.ctx.arc(this.rad, this.rad, this.rad, ang, ang + this.arc0);
    this.ctx.lineTo(this.rad, this.rad);
    this.ctx.fill();
    // TEXT
    this.ctx.translate(this.rad, this.rad);
    this.ctx.rotate(ang + this.arc0 / 2);
    this.ctx.textAlign = 'right';
    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 30px sans-serif';
    this.ctx.fillText(sector.label.name, this.rad - 10, 10);
    //
    this.ctx.restore();
  }

  rotate(first = false) {
    if (!this.ctx || !this.spin) return;

    const index = this.getIndex();
    const sector = this.sectors[index];

    if (sector) {
      this.ctx.canvas.style.transform = `rotate(${this.ang - this.PI / 2}rad)`;
      this.spin.nativeElement.textContent = !this.angVel ? 'spin' : sector.label.name;
      if (!first) {
        this.lastSelection = !this.angVel ? this.lastSelection : index;
        this.deleteOption();
      }
      this.spin.nativeElement.style.background = sector.color;
    }
  }

  frame() {
    if (!this.angVel) return;

    this.angVel *= this.friction; // Decrement velocity by friction
    if (this.angVel < 0.002) this.angVel = 0; // Bring to stop
    this.ang += this.angVel; // Update angle
    this.ang %= this.TAU; // Normalize angle
    this.rotate();
  }

  engine() {
    if (!isPlatformBrowser(this.platformId)) return; // Check if we're on the server
    requestAnimationFrame(this.frame.bind(this));
  }

  deleteOption() {
    if (this.modeDelete && !this.angVel && this.lastSelection !== undefined) {
      if (this.spin) {
        this.spin.nativeElement.textContent = this.sectors[this.lastSelection].label.name;
        setTimeout(() => {
          this.addNewWinner(this.sectors[this.lastSelection].label);
        }, 1200);
      }
    }
  }

  restartWinner() {
    // Implement your logic for restarting winners here
  }

  addNewWinner(value: any) {
    const dialogRef = this.dialog.open(PlayerCardComponent, {
      width: '800px',
      panelClass: 'custom-dialog-container',
      data: { value }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'sold') {
        if (this.spin) {
          this.spin.nativeElement.textContent = this.sectors[this.lastSelection].label.name;
          this.sectors.splice(this.lastSelection, 1);
          this.dataService.deleteOption(value)
          setTimeout(() => {
            this.createWheel();
          }, 1200);
        }
      } else if (result === 'unsold') {
        this.dataService.addUnsold(value);
        if (this.spin) {
          this.spin.nativeElement.textContent = this.sectors[this.lastSelection].label.name;
          this.sectors.splice(this.lastSelection, 1);
          this.dataService.deleteOption(value)
          setTimeout(() => {
            this.createWheel();
          }, 1200);
        }
      }
    });
  }
}
