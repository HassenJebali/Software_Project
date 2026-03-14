package com.app.taskmanagement.services;

import com.app.taskmanagement.dto.ProjectRequest;
import com.app.taskmanagement.exception.ResourceNotFoundException;
import com.app.taskmanagement.models.Project;
import com.app.taskmanagement.models.User;
import com.app.taskmanagement.repositories.ProjectRepository;
import com.app.taskmanagement.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(String id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    public Project createProject(ProjectRequest request, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + ownerEmail));
        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            project.setStatus(request.getStatus());
        }
        project.setOwnerId(owner.getId());
        return projectRepository.save(project);
    }

    public Project updateProject(String id, ProjectRequest request) {
        Project project = getProjectById(id);
        if (request.getTitle() != null) {
            project.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            project.setStatus(request.getStatus());
        }
        return projectRepository.save(project);
    }

    public void deleteProject(String id) {
        Project project = getProjectById(id);
        projectRepository.delete(project);
    }
}
