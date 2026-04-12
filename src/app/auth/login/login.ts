import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginComponent implements OnInit {

  isScrolled   = false;
  modalOpen    = false;
  billingAnnual = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initParticles();
    this.initStatsObserver();
    this.initRevealObserver();
    this.initGoogle();
  }

  @HostListener('window:scroll')
  onScroll() { this.isScrolled = window.scrollY > 40; }

  @HostListener('document:keydown.escape')
  onEsc() { this.closeModal(); }

  openModal()  { this.modalOpen = true;  document.body.style.overflow = 'hidden'; }
  closeModal() { this.modalOpen = false; document.body.style.overflow = ''; }
  onOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) this.closeModal();
  }

  toggleBilling() { this.billingAnnual = !this.billingAnnual; }

  initGoogle() {
    const waitForGoogle = setInterval(() => {
      if (typeof google !== 'undefined') {
        clearInterval(waitForGoogle);
        google.accounts.id.initialize({
          client_id: '107744191965-81u4lmkf2s6r93vjbf5s0nji42h0sa5d.apps.googleusercontent.com',
          callback: this.handleLogin.bind(this)
        });
        this.renderGoogleBtn();
      }
    }, 200);
  }

  renderGoogleBtn() {
    const el = document.getElementById('googleBtn');
    if (el) {
      google.accounts.id.renderButton(el, {
        theme: 'outline', size: 'large', width: 320, text: 'continue_with'
      });
    }
  }

  onModalOpened() {
    setTimeout(() => this.renderGoogleBtn(), 80);
  }

  async handleLogin(response: any) {
    const token   = response.credential;
    const payload = JSON.parse(atob(token.split('.')[1]));
    try {
      const res = await fetch('http://localhost:8080/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Auth failed');
      const user: any = await res.json();
      localStorage.setItem('google_token',   token);
      localStorage.setItem('user_name',      payload.given_name);
      localStorage.setItem('user_fullname',  payload.name);
      localStorage.setItem('user_photo',     payload.picture);
      localStorage.setItem('role',           user.role || 'USER');
      if (user.role === 'ADMIN') {
        this.router.navigate(['/admin/dashboard'], { replaceUrl: true });
      } else {
        this.router.navigate(['/client/home'], { replaceUrl: true });
      }
    } catch (err) {
      console.error('LOGIN ERROR:', err);
      alert('Error autenticando con el backend');
    }
  }

  initParticles() {
    const canvas = document.getElementById('lc-particles') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let W: number, H: number;
    interface Particle { x:number; y:number; r:number; dx:number; dy:number; o:number; c:string; }
    let particles: Particle[] = [];

    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    const init   = () => {
      resize();
      particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.3, dy: (Math.random() - 0.5) * 0.3,
        o: Math.random() * 0.5 + 0.1,
        c: Math.random() > 0.5 ? '139,92,246' : '59,130,246'
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.o})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > W) p.dx *= -1;
        if (p.y < 0 || p.y > H) p.dy *= -1;
      });
      requestAnimationFrame(draw);
    };
    window.addEventListener('resize', resize);
    init(); draw();
  }

  initRevealObserver() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    }, 100);
  }

  initStatsObserver() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll<HTMLElement>('[data-target]').forEach(el => {
          const target = +(el.dataset['target'] ?? 0);
          const isPercent = target === 98;
          const suffix = isPercent ? '%' : '+';
          let current = 0;
          const step  = Math.ceil(target / 60);
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current.toLocaleString() + suffix;
            if (current >= target) clearInterval(timer);
          }, 25);
        });
        io.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    setTimeout(() => {
      const s = document.querySelector('.stats');
      if (s) io.observe(s);
    }, 100);
  }
}