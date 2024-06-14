package com.groupware.work.dev.controller;

import com.groupware.work.dev.dto.*;
import com.groupware.work.dev.service.DevService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/projects")
public class DevController {

    private final DevService workService;

    @Autowired
    public DevController(DevService workService) {
        this.workService = workService;
    }

    @GetMapping("/list")
    public ResponseEntity<List<ProjectDTO>> getProject(@RequestParam String employeeCode) {
        List<ProjectDTO> projects = workService.getProjects(employeeCode);
        return ResponseEntity.ok(projects);
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

    @GetMapping("/{projectId}/members")
    public ResponseEntity<List<ProjectMemberDTO>> getProjectMembers(@PathVariable int projectId) {
        List<ProjectMemberDTO> members = workService.getProjectMembers(projectId);
        return ResponseEntity.ok(members);
    }

    @GetMapping("/{projectId}/tasks")
    public ResponseEntity<List<ProjectTaskDTO>> getProjectTasks(@PathVariable int projectId){
        List<ProjectTaskDTO> tasks = workService.getProjectTasks(projectId);
        System.out.println(tasks);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{projectId}/editProject")
    public ResponseEntity<Map<String, Object>> editProject(@PathVariable int projectId) {

        ProjectDTO info = workService.getProjectInfo(projectId);
        List<ProjectMemberDTO> members = workService.getProjectMembers(projectId);
        List<ProjectTaskDTO> tasks = workService.getProjectTasks(projectId);

        Map<String, Object> response = new HashMap<>();
        response.put("info", info);
        response.put("members", members);
        response.put("tasks", tasks);

        System.out.println(response);
        return ResponseEntity.ok(response);
    }

}
