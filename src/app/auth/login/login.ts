import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '107744191965-81u4lmkf2s6r93vjbf5s0nji42h0sa5d.apps.googleusercontent.com',
      callback: this.handleLogin.bind(this)
    });

    google.accounts.id.renderButton(
      document.getElementById('googleBtn'),
      {
        theme: 'outline',
        size: 'large',
        width: 280
      }
    );
  }

handleLogin(response: any) {
  const token = response.credential;

  const payload = JSON.parse(atob(token.split('.')[1]));

  fetch('http://localhost:8080/api/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => {
    if (!res.ok) {
      throw new Error('Auth failed');
    }
    return res.json();
  })
  .then((user: any) => {

    localStorage.setItem('google_token', token);
    localStorage.setItem('user_name', payload.given_name); 
    localStorage.setItem('user_fullname', payload.name); 
    localStorage.setItem('user_photo', payload.picture);
    localStorage.setItem('role', user.role || 'USER');   

    if (user.role === 'ADMIN') {
      this.router.navigate(['/admin/dashboard'], { replaceUrl: true });
    } else {
     this.router.navigate(['/client/home'], { replaceUrl: true });
    }
  })
  .catch(err => {
    console.error('LOGIN ERROR:', err);
    alert('Error autenticando con backend');
  });
}

}
