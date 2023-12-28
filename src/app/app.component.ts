import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showNavbar: boolean = true;
  canReadUsers: boolean = false;
  canSearchVacuum: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !(event.url === '/');
        this.checkPermissions()
      }
    });
  }

  checkPermissions() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      const decoded = jwtDecode(jwt) as any;
      this.canReadUsers = decoded.permissions.includes('can_read_users');
      this.canSearchVacuum = decoded.permissions.includes('can_search_vacuum');
    } else {
      this.canReadUsers = false;
      this.canSearchVacuum = false;
    }

    
  }

  logout(): void {
    localStorage.removeItem('jwt')
    this.router.navigate(['/'])
  }
}
