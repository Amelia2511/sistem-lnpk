import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LamanUtamaComponent } from './laman-utama/laman-utama.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, LamanUtamaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sistem-lnpk';
}
