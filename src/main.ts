import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app';
import { AppRoutingModule } from './app/app.routing-module';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(AppRoutingModule.routes)
  ]
})
.catch(err => console.error(err));
