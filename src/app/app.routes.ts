import { Routes } from '@angular/router';
import { TeamsComponent } from './teams/teams.component';
import { WheelViewComponent } from './wheel-view/wheel-view.component';

export const routes: Routes = [
  {path:'', component: WheelViewComponent},
  {path:'teams', component:TeamsComponent}
];
