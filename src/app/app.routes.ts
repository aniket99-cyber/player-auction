import { Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { TeamsComponent } from './teams/teams.component';
import { WheelViewComponent } from './wheel-view/wheel-view.component';

export const routes: Routes = [
  {path:'', component: OverviewComponent},
  {path:'auction', component: WheelViewComponent},
  {path:'teams', component:TeamsComponent}
];
