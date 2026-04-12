import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { routes } from './app.routes';
import { authInterceptor } from './auth/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations'; 
import { provideMarkdown } from 'ngx-markdown';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, 
                          withInMemoryScrolling({
                            scrollPositionRestoration: 'top',
                            anchorScrolling: 'enabled'
                          })), 
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    importProvidersFrom(FormsModule),
    provideAnimations(),
    provideMarkdown()
  ]
};
