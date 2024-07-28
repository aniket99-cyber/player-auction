import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { WheelComponent } from '../wheel/wheel.component';

@Component({
  selector: 'app-wheel-view',
  standalone: true,
  imports: [WheelComponent, CommonModule],
  templateUrl: './wheel-view.component.html',
  styleUrl: './wheel-view.component.scss'
})
export class WheelViewComponent {
  constructor(public dataService: DataService){
  }
}
