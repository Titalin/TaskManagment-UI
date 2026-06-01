import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KanbanComponent} from './components/kanban/kanban.component';
import { DragDropModule } from
"@angular/cdk/drag-drop";

import { MatCardModule } from "@angular/material/card";

import { MatIconModule } from "@angular/material/icon";
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    KanbanComponent, 
    DragDropModule, 
    MatCardModule,MatIconModule, 
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('TaskManagment-UI');
}
