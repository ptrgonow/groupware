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

    @GetMapping("/{projectId}/editProject")     // 모달창에서 불러올 프로젝트 정보
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

    @PostMapping("/update")
    public ResponseEntity<Map<String, String>> updateProject(
            @RequestBody ProjectUpdateRequestDTO request) {

        ProjectDTO project = request.getProject();
        List<ProjectMemberDTO> member = request.getMembers();


        System.out.println(project);

        try {
            workService.updateProject(project, member); // 서비스에서 프로젝트 및 작업 업데이트
            return ResponseEntity.ok(Map.of("status", "success"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

}
