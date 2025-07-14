import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataService } from '../data.service';

@Component({
  selector: 'app-team-assign',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './team-assign.component.html',
  styleUrl: './team-assign.component.scss'
})
export class TeamAssignComponent implements OnInit, OnDestroy {
  teams: any[] = [];
  importedPlayers: any[] = [];
  teamForms: WritableSignal<FormGroup[]> = signal([]);
  subscription!: Subscription;

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit(): void {
    this.teams = this.dataService.teams;

    const forms = this.teams.map(() =>
      this.fb.group({
        captain: [null, Validators.required],
        owners: [null, Validators.required],
        retentionPlayer: [null]
      })
    );
    this.teamForms.set(forms);

    this.subscription = this.dataService.option$.subscribe(players => {
      this.importedPlayers = players ?? [];
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getFormControl(form: FormGroup, controlName: string): FormControl<any> {
    return form.get(controlName) as FormControl<any>;
  }

  teamFormsArray(): FormGroup[] {
    return this.teamForms();
  }

  comparePlayers = (a: any, b: any): boolean => a && b && a.id === b.id;

submit(): void {
  const allForms = this.teamFormsArray();
  const selectedPlayerIds = new Set<number>();
  let isValid = true;
  let errorMessage = '';
  const tempTeams = [];

  for (let i = 0; i < this.teams.length; i++) {
    const form = allForms[i];
    const team = this.teams[i];

    if (!form) {
      isValid = false;
      errorMessage = `Form missing for team ${team.name}`;
      break;
    }

    const captain = form.get('captain')?.value;
    const retention = form.get('retentionPlayer')?.value;
    const rawOwners = form.get('owners')?.value;
    const owners = Array.isArray(rawOwners) ? rawOwners : rawOwners ? [rawOwners] : [];

    // Required fields check
    if (!captain || owners.length === 0) {
      isValid = false;
      errorMessage = `Please select a captain and at least one owner for team: ${team.name}`;
      break;
    }

    // Unique player check
    const selections = [captain, retention, ...owners].filter(Boolean);
    for (const player of selections) {
      if (player?.id) {
        if (selectedPlayerIds.has(player.id)) {
          isValid = false;
          errorMessage = `Player "${player.name}" is assigned to multiple teams or roles.`;
          break;
        }
        selectedPlayerIds.add(player.id);
      }
    }

    if (!isValid) break;

    // Add retention as first player
    const updatedPlayers = [...team.players];
    if (retention) {
      const retentionSoldData = {
        value: {
          ...retention,
          team: team.id,
          points: 1500
        }
      };
      updatedPlayers.unshift(retentionSoldData.value);
    }

    tempTeams.push({
      ...team,
      captain,
      owners,
      players: updatedPlayers,
      remainingAmount: retention ? team.remainingAmount + 1500 : team.remainingAmount
    });
  }

  // Stop if invalid
  if (!isValid) {
    alert(`❌ ${errorMessage}`);
    return;
  }

  // Add retention players as winners (sold for 1500 points)
  tempTeams.forEach((team, i) => {
    const form = allForms[i];
    const retention = form.get('retentionPlayer')?.value;

    if (retention) {
      const retentionSoldData = {
        value: {
          ...retention,
          team: team.id,
          points: 1500
        }
      };
      this.dataService.addWinner(retentionSoldData);
    }
  });

  // ✅ Update final teams in data service
  this.dataService.updateTeams(tempTeams);

  // ✅ Remove assigned players (captains, retention, owners) from imported list
  const assignedIds = new Set<number>();

  allForms.forEach((form) => {
    const captain = form.get('captain')?.value;
    const retention = form.get('retentionPlayer')?.value;
    const rawOwners = form.get('owners')?.value;
    const owners = Array.isArray(rawOwners) ? rawOwners : rawOwners ? [rawOwners] : [];

    if (captain?.id) assignedIds.add(captain.id);
    if (retention?.id) assignedIds.add(retention.id);
    owners.forEach(owner => {
      if (owner?.id) assignedIds.add(owner.id);
    });
  });

  // Get current optionSource (imported players) and remove assigned
  const currentOpts = this.dataService.optionSource.getValue() || [];
  const remainingPlayers = currentOpts.filter(player => !assignedIds.has(player.id));

  // ✅ Update options with only remaining players
  this.dataService.updateDefaultOptions(remainingPlayers);

  console.log('✅ Final teams updated');
  console.log('✅ Remaining players updated in optionSource', remainingPlayers);
}


}
