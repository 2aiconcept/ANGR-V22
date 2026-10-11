import { Component, computed, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-avatar-initials',
  styleUrl: './avatar-initials.scss',
  templateUrl: './avatar-initials.html',
})
export class AvatarInitials {
  readonly nom = input.required<string>();

  // « TechVision » → « T », « Durand Industries » → « DI »
  protected readonly initiales = computed(() =>
    this.nom()
      .split(' ')
      .filter((mot) => mot.length > 1) // ignore « & » dans « Berthier & Fils »
      .slice(0, 2)
      .map((mot) => mot[0])
      .join('')
      .toUpperCase(),
  );
}
