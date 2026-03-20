import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  menuOpen = false;
  isDarkMode: boolean = false;
  userName = 'Administrador';
  userPhoto = '';
  mobileMenuOpen = false;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userName = localStorage.getItem('user_name') || 'Admin';
    this.userPhoto = localStorage.getItem('user_photo') || '';

    this.isDarkMode = localStorage.getItem('theme') === 'dark';
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/'], { replaceUrl: true });
  }

  toggleTheme() {
    document.documentElement.classList.toggle('dark');
    this.isDarkMode = !this.isDarkMode;
  }
}
