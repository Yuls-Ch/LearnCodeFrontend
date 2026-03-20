// src/app/pages/subscription/subscription.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
import { SubscriptionService } from '../../service/SubscriptionService';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription.html',
  styleUrls: ['./subscription.scss'],
})
export class SubscriptionComponent implements OnInit {
  subscription: {
    id: string | null;
    planCode: string;
    status: string;
    startAt: Date | null;
    endAt: Date | null;
  } | null = null;

  loading = true;

  constructor(
    private service: SubscriptionService,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    // Carga normal
    this.loadSubscription();

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.loadSubscription();
    });
  }

  loadSubscription() {
    this.loading = true;
    this.subscription = null;

    this.service.getMySubscription().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.subscription = {
            ...res.data,
            startAt: res.data.startAt ? new Date(res.data.startAt) : null,
            endAt: res.data.endAt ? new Date(res.data.endAt) : null,
          };
        } else {
          this.subscription = {
            id: null,
            planCode: 'FREE',
            status: 'ACTIVE',
            startAt: null,
            endAt: null,
          };
        }
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  canCancel(startAt: Date | null): boolean {
    if (!startAt) return false;
    const diff = Date.now() - new Date(startAt).getTime();
    const hours = diff / (1000 * 60 * 60);
    return hours <= 48;
  }

  planName(code: string) {
    if (code === 'FREE') return 'Free';
    if (code === 'ORO') return 'Oro';
    if (code === 'PLATINO') return 'Platino';
    if (code === 'DIAMANTE') return 'Diamante';
    return code;
  }

  cancelSubscription() {
    Swal.fire({
      title: '¿Cancelar suscripción?',
      text: 'Podrás perder los beneficios del plan actual.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, volver',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.cancelMySubscription().subscribe({
          next: (res) => {
            if (res.success) {
              Swal.fire({
                title: 'Cancelada',
                text: res.mensaje,
                icon: 'success',
                confirmButtonColor: '#7c3aed',
              }).then(() => {
                this.loadSubscription();
                setTimeout(() => {
                  this.cd.detectChanges();
                }, 0);
              });
            } else {
              Swal.fire('Error', res.mensaje, 'error');
            }
          },
          error: () => {
            Swal.fire('Error', 'No se pudo cancelar la suscripción', 'error');
          },
        });

      }
    });
  }
}
