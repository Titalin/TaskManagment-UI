import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TaskDto } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, MatCardModule, MatIconModule],
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit {
  todo: TaskDto[] = [];
  done: TaskDto[] = [];
  newTaskTitle = '';
  newTaskDescription = '';
  showDialog = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' | '' = '';
  dialogError = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.todo = tasks.filter(t => !t.isCompleted);
        this.done = tasks.filter(t => t.isCompleted);
      },
      error: (err) => console.error('Error al cargar tareas', err)
    });
  }

  openDialog() {
    this.dialogError = '';
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.dialogError = '';
  }

  addTask() {
    const request = {
      title: this.newTaskTitle.trim(),
      description: this.newTaskDescription.trim()
    };

    if (!request.title || !request.description) {
      this.dialogError = 'Debe ingresar título y descripción antes de agregar la tarea.';
      return;
    }

    this.taskService.createTask(request).subscribe({
      next: (task) => {
        this.todo.unshift(task);
        this.showDialog = false;
        this.newTaskTitle = '';
        this.newTaskDescription = '';
        this.showNotification('Tarea creada correctamente.', 'success');
      },
      error: (err) => {
        console.error('No se pudo crear la tarea', err);
        this.dialogError = 'Error al crear la tarea. Intente de nuevo.';
        this.showNotification('No se pudo crear la tarea. Verifique los datos e intente otra vez.', 'error');
      }
    });
  }

  private showNotification(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;

    setTimeout(() => {
      this.notificationMessage = '';
      this.notificationType = '';
    }, 4000);
  }

  drop(event: CdkDragDrop<TaskDto[]>) {
    if (event.previousContainer === event.container) {
      // Movimiento dentro de la misma columna
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Movimiento entre columnas (Cambio de estado)
      const task = event.previousContainer.data[event.previousIndex];

      // Llamada al Backend para persistir el cambio
      this.taskService.completeTask(task.id).subscribe({
        next: () => {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        },
        error: (err) => console.error('No se pudo actualizar la tarea', err)
      });
    }
  }
}