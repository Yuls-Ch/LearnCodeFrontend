import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { PlanService } from '../../service/PlanService';
import { Plan } from '../../models/Plan';
import { Subscription } from '../../models/Subscription';
import { forkJoin } from 'rxjs';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './plans.html'
})
export class PlansComponent implements OnInit {

  plans: Plan[] = [];
  currentPlan: string | null = null;

  loading = true;

  constructor(
    private planService: PlanService,
    private cd: ChangeDetectorRef,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.checkPaymentSuccess();
    this.loadAll();
  }

  checkPaymentSuccess() {
    this.route.queryParams.subscribe(params => {
      if (params['success'] === 'true') {
        Swal.fire({
          icon: 'success',
          title: '¡Pago exitoso!',
          text: 'Tu plan ha sido activado correctamente.',
          confirmButtonText: 'Continuar'
        });
      }
      if (params['canceled'] === 'true') {
        Swal.fire({
          icon: 'info',
          title: 'Pago cancelado',
          text: 'No se realizó ningún cobro.',
          confirmButtonText: 'Volver a planes'
        });
      }
    });
  }
  
  //  Cargar planes + subscripcion
loadAll() {

  this.loading = true;

  forkJoin({
    plans: this.planService.getPlans(),
    sub: this.planService.getMySubscription()
  })
  .subscribe({
    next: res => {

      // Planes
      this.plans = res.plans.data;

      // Subscripción
        const sub = res.sub.data; 
        if (sub?.status === 'ACTIVE') {
          this.currentPlan = sub.planCode;
        } else {
          this.currentPlan = null;
        }

      this.loading = false;
      this.cd.detectChanges();
    },
    error: err => {

      console.error('Error cargando datos', err);

      this.loading = false;

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los planes'
      });
    }
  });
}

  // Control de seleccion
  selectPlan(code: string) {

    // Ya tiene este plan
    if (code === this.currentPlan) return;

    // Tiene otro plan
    if (this.currentPlan) {

      Swal.fire({
        title: '¿Cambiar de plan?',
        text: 'Se cancelará tu plan actual',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar'
      }).then(res => {

        if (res.isConfirmed) {
          this.buy(code);
        }

      });

      return;
    }

    // Sin plan
    this.buy(code);
  }

  // Stripe
  buy(planCode: string) {

  Swal.fire({
    title: 'Redirigiendo a Stripe...',
    text: 'Procesando pago',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  this.http.post<any>(
    'http://localhost:8080/api/stripe/checkout',
    null,
    {
      params: { planCode },
      headers: {
        Authorization:
          'Bearer ' + localStorage.getItem('google_token')
      }
    }
  )
  .subscribe({
    next: res => {

      if (!res.success) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: res.message || 'Error iniciando checkout'
        });
        return;
      }

      window.location.href = res.data.url;
    },
    error: () => {

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo iniciar el pago'
      });
    }
  });
}
}
