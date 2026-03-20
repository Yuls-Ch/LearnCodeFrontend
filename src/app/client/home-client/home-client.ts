import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-client',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-client.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeClient {

  userName = 'Usuario';

  ngOnInit() {
    this.userName = localStorage.getItem('user_name') || 'Usuario';
  }

}