import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MainNav } from '../main-nav/main-nav';

@Component({
  imports: [RouterLink, MainNav],
  selector: 'app-header',
  styleUrl: './app-header.scss',
  templateUrl: './app-header.html',
})
export class AppHeader {}
