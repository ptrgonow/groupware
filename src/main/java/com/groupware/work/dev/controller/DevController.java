package com.groupware.work.dev.controller;

import com.groupware.user.dto.PrMemDTO;
import com.groupware.user.dto.UserDTO;
import com.groupware.user.service.UserService;
import com.groupware.work.dev.dto.*;
import com.groupware.work.dev.service.DevService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pr")
@AllArgsConstructor
public class DevController {

    private final DevService devService;
    private final UserService userService;


    @GetMapping("/mem/list")
    public ResponseEntity<Map<String, Object>> getMembers() {
        List<PrMemDTO> user = userService.getAllEmployees();
        System.out.println("=====================================");
        System.out.println(user);
        System.out.println("=====================================");
        Map<String, Object> response = new HashMap<>();
        response.put("members", user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/details")
    public ResponseEntity<Map<String, Object>> getProjectDetails(@RequestParam("projectId") int projectId) {
        ProjectDetailsDTO projectDetails = devService.getProjectDetails(projectId);
        if (projectDetails == null) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("project", projectDetails);
        response.put("members", projectDetails.getMembers());
        response.put("tasks", projectDetails.getTasks());
        response.put("feeds", projectDetails.getFeeds());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/insert")
    public void insertProject(@ModelAttribute ProjectDTO projectDTO, HttpServletResponse response) throws IOException {
        try {
            ProjectDTO project = new ProjectDTO();
            project.setProjectName(projectDTO.getProjectName());
            project.setStartDate(projectDTO.getStartDate());
            project.setEndDate(projectDTO.getEndDate());
            project.setStatus(projectDTO.getStatus());
            project.setDepartmentId(projectDTO.getDepartmentId());
            project.setDescription(projectDTO.getDescription());
            project.setEmployeeCode(projectDTO.getEmployeeCode());
            devService.insertProject(project);

            response.sendRedirect("/dev");
        } catch (Exception e) {
            response.sendRedirect("/error");
        }
    }

    @PostMapping("/edit")
    public ResponseEntity<String> editProject(@RequestBody ProjectUpdateRequestDTO projectUpdateRequest) {
        try {
            devService.updateProject(
                    projectUpdateRequest.getProjectDTO(),
                    projectUpdateRequest.getMembers(),
                    projectUpdateRequest.getTasks()
            );
            return ResponseEntity.ok("프로젝트 정보가 수정되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("프로젝트 정보 수정 중 오류가 발생했습니다.");
        }

    }

    @PostMapping("/feed/add")
    public ResponseEntity<String> addFeed(@RequestBody ProjectFeedDTO projectFeedDTO) {
        try {
            ProjectFeedDTO feed = new ProjectFeedDTO();
            feed.setProjectId(projectFeedDTO.getProjectId());
            feed.setEmployeeCode(projectFeedDTO.getEmployeeCode());
            feed.setContent(projectFeedDTO.getContent());
            devService.addFeed(feed);
            return ResponseEntity.ok().body("피드가 추가되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("피드 추가 중 오류가 발생했습니다.");
        }
    }

    @PostMapping("/task/add")
    public ResponseEntity<String> addTask(@RequestBody ProjectTaskDTO projectTaskDTO) {
        try {
            ProjectTaskDTO task = new ProjectTaskDTO();
            task.setProjectId(projectTaskDTO.getProjectId());
            task.setTaskEmployeeCode(projectTaskDTO.getTaskEmployeeCode());
            task.setTaskContent(projectTaskDTO.getTaskContent());
            task.setTaskProgress(projectTaskDTO.getTaskProgress());
            devService.addTask(task);
            return ResponseEntity.ok().body("작업이 추가되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("작업 추가 중 오류가 발생했습니다.");
        }
    }

    @PostMapping("/task/delete")
    public ResponseEntity<String> deleteTask(@RequestParam("taskId") int taskId) {
        try {
            devService.deleteTask(taskId);
            return ResponseEntity.ok().body("작업이 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("작업 삭제 중 오류가 발생했습니다.");
        }
    }


}
