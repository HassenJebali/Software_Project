import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];
  tasks: Task[] = [];
  todoCount = 0;
  inProgressCount = 0;
  doneCount = 0;
  userName = '';

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userName = this.authService.getCurrentUser()?.name || '';
    this.projectService.getProjects().subscribe(p => this.projects = p);
    this.taskService.getTasks().subscribe(t => {
      this.tasks = t;
      this.todoCount = t.filter(task => task.status === 'TODO').length;
      this.inProgressCount = t.filter(task => task.status === 'IN_PROGRESS').length;
      this.doneCount = t.filter(task => task.status === 'DONE').length;
    });
  }
}
