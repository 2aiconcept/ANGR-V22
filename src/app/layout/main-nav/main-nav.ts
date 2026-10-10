import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-main-nav',
  styleUrl: './main-nav.scss',
  templateUrl: './main-nav.html',
})
export class MainNav {}
