package com.groupware.work.dev.controller;

import com.groupware.user.dto.UserDTO;
import com.groupware.user.service.UserService;
import com.groupware.work.dev.dto.ProjectDTO;
import com.groupware.work.dev.dto.ProjectDetailsDTO;
import com.groupware.work.dev.service.DevService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pr")
public class DevController {

    private final DevService devService;
    private final UserService userService;

    @Autowired
    public DevController(DevService devService, UserService userService) {
        this.devService = devService;
        this.userService = userService;
    }

    @GetMapping("/list")
    public ResponseEntity<List<ProjectDTO>> getProjectList(HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        List<ProjectDTO> projects = devService.getProjects(user.getEmployeeCode());
        return ResponseEntity.ok(projects);
    }


    @GetMapping("/details")
    public ResponseEntity<Map<String, Object>> getProjectDetails(@RequestParam int projectId) {
        ProjectDetailsDTO projectDetails = devService.getProjectDetails(projectId);
        if (projectDetails == null) {
            return ResponseEntity.notFound().build();
        }
        UserDTO user = userService.getUserDetails(projectDetails.getEmployeeCode());

        Map<String, Object> response = new HashMap<>();
        response.put("project", projectDetails);
        response.put("members", projectDetails.getMembers());
        response.put("tasks", projectDetails.getTasks());
        response.put("user", user);

        return ResponseEntity.ok(response);
    }
}
