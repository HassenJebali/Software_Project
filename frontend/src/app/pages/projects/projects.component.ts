import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  standalone: false
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  showForm = false;
  editingProject: Project | null = null;
  projectForm: FormGroup;

  constructor(private projectService: ProjectService, private fb: FormBuilder) {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['ACTIVE']
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe(p => this.projects = p);
  }

  openCreate(): void {
    this.editingProject = null;
    this.projectForm.reset({ status: 'ACTIVE' });
    this.showForm = true;
  }

  openEdit(project: Project): void {
    this.editingProject = project;
    this.projectForm.patchValue(project);
    this.showForm = true;
  }

  saveProject(): void {
    if (this.projectForm.invalid) return;
    if (this.editingProject) {
      this.projectService.updateProject(this.editingProject.id, this.projectForm.value).subscribe(() => {
        this.loadProjects();
        this.showForm = false;
      });
    } else {
      this.projectService.createProject(this.projectForm.value).subscribe(() => {
        this.loadProjects();
        this.showForm = false;
      });
    }
  }

  deleteProject(id: string): void {
    if (confirm('Delete this project?')) {
      this.projectService.deleteProject(id).subscribe(() => this.loadProjects());
    }
  }

  cancelForm(): void {
    this.showForm = false;
  }
}
