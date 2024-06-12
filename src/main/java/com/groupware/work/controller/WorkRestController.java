package com.groupware.work.controller;

import com.groupware.work.dev.dto.ProjectDTO;
import com.groupware.work.dev.dto.ProjectFeedDTO;
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

    @GetMapping("/list")
    public ResponseEntity<List<ProjectDTO>> getProject(@RequestParam String employeeCode) {
        List<ProjectDTO> projects = workService.getProjects(employeeCode);
        return ResponseEntity.ok(projects); // 형변환 제거
    }
    @GetMapping("/{projectId}/feeds")
    public ResponseEntity<List<ProjectFeedDTO>> getProjectFeeds(@PathVariable int projectId) {
        List<ProjectFeedDTO> feeds = workService.getFeed(projectId);

        return ResponseEntity.ok(feeds);
    }

    @GetMapping("/{projectId}/projectInfo")
    public ResponseEntity<ProjectDTO> getProjectInfo(@PathVariable int projectId){
        ProjectDTO info = workService.getProjectInfo(projectId);
        System.out.println(info);
        return ResponseEntity.ok(info);
    }

}
