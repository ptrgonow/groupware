package com.groupware.work.controller;

import com.groupware.work.dev.dto.ProjectDTO;
import com.groupware.work.service.WorkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
public class WorkRestController {

    private final WorkService workService;

    @Autowired
    public WorkRestController(WorkService workService) {
        this.workService = workService;
    }

    @GetMapping("/{employeeCode}")
    public ResponseEntity <ProjectDTO> getProject(@RequestParam String employeeCode) {

        List<ProjectDTO> projects = workService.getProjects(employeeCode);

        return ResponseEntity.ok((ProjectDTO) projects);
    }

}
