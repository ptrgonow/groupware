package com.groupware.work.dev.controller;

import com.groupware.user.dto.UserDTO;
import com.groupware.user.service.UserService;
import com.groupware.work.dev.dto.ProjectDTO;
import com.groupware.work.dev.dto.ProjectDetailsDTO;
import com.groupware.work.dev.dto.ProjectFeedDTO;
import com.groupware.work.dev.dto.ProjectUpdateRequestDTO;
import com.groupware.work.dev.service.DevService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/pr")
public class DevController {

    private final DevService devService;

    @Autowired
    public DevController(DevService devService) {
        this.devService = devService;
    }

    @GetMapping("/details")
    public ResponseEntity<Map<String, Object>> getProjectDetails(@RequestParam int projectId) {
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

    @PostMapping("/feed")
    public ResponseEntity<String> addFeed(@RequestBody ProjectFeedDTO projectFeedDTO) {
        try {
            System.out.println(projectFeedDTO);
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


}
