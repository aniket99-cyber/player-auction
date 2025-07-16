import { Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { TeamsComponent } from './teams/teams.component';
import { WheelViewComponent } from './wheel-view/wheel-view.component';
import { TeamAssignComponent } from './team-assign/team-assign.component';
import { TeamAssignGuard } from './guards/team-assign.guard';

export const routes: Routes = [
  {path:'', component: OverviewComponent},
  {path:'auction', component: WheelViewComponent},
  {path:'teams', component:TeamsComponent},
  {path:'assign', component:TeamAssignComponent,  canActivate: [TeamAssignGuard]}
];
