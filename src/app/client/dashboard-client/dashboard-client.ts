import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChatbotComponent } from '../chatbot/chatbot';

@Component({
  selector: 'app-dashboard-client',
  standalone: true,
  imports: [CommonModule, RouterModule, ChatbotComponent],
  templateUrl: './dashboard-client.html',
  styleUrl: './dashboard-client.scss'
})
export class DashboardClient {
  menuOpen = false;
  userPhoto = '';
  isDarkMode: boolean = false;
  mobileMenuOpen = false;

  constructor(private router: Router) {}

  ngOnInit() {
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