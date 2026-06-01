import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { DragDropModule } from
"@angular/cdk/drag-drop";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { KanbanComponent } from './components/kanban/kanban.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    MatCardModule,
    MatIconModule,
    DragDropModule,
    provideHttpClient(),
    KanbanComponent
  ]
};
