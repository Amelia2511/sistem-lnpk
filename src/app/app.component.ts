import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { StepperModule } from 'primeng/stepper';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule, SideMenuComponent, MatCardModule, StepperModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sistem-lnpk';
  showHeader = true;
  showLayout = true;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      const hideOnRoutes = ['/log-masuk', '/daftar-akaun'];
      const shouldHide = hideOnRoutes.includes(url);

      this.showHeader = !shouldHide;
      this.showLayout = !shouldHide;
    });
  }
}
