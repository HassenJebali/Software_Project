import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { Task } from '../../models/task.model';
import { Project } from '../../models/project.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  standalone: false
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  projects: Project[] = [];
  users: User[] = [];
  showForm = false;
  editingTask: Task | null = null;
  taskForm: FormGroup;
  filterProjectId = '';

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['TODO'],
      assignedUserId: [''],
      projectId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filterProjectId = params['projectId'] || '';
      this.loadTasks();
    });
    this.projectService.getProjects().subscribe(p => this.projects = p);
    this.userService.getUsers().subscribe(u => this.users = u);
  }

  loadTasks(): void {
    if (this.filterProjectId) {
      this.taskService.getTasksByProject(this.filterProjectId).subscribe(t => this.tasks = t);
    } else {
      this.taskService.getTasks().subscribe(t => this.tasks = t);
    }
  }

  openCreate(): void {
    this.editingTask = null;
    this.taskForm.reset({ status: 'TODO', projectId: this.filterProjectId });
    this.showForm = true;
  }

  openEdit(task: Task): void {
    this.editingTask = task;
    this.taskForm.patchValue(task);
    this.showForm = true;
  }

  saveTask(): void {
    if (this.taskForm.invalid) return;
    if (this.editingTask) {
      this.taskService.updateTask(this.editingTask.id, this.taskForm.value).subscribe(() => {
        this.loadTasks();
        this.showForm = false;
      });
    } else {
      this.taskService.createTask(this.taskForm.value).subscribe(() => {
        this.loadTasks();
        this.showForm = false;
      });
    }
  }

  deleteTask(id: string): void {
    if (confirm('Delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => this.loadTasks());
    }
  }

  cancelForm(): void {
    this.showForm = false;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'TODO': return 'warn';
      case 'IN_PROGRESS': return 'accent';
      case 'DONE': return 'primary';
      default: return '';
    }
  }

  getProjectName(projectId: string): string {
    return this.projects.find(p => p.id === projectId)?.title || projectId;
  }

  getUserName(userId: string): string {
    return this.users.find(u => u.id === userId)?.name || '';
  }
}
