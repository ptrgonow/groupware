package com.groupware.work.controller;

import com.groupware.work.dev.dto.ProjectDTO;
import com.groupware.work.service.WorkService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.net.http.HttpResponse;
import java.util.List;

@Controller
public class WorkController {

    private final WorkService workService;

    public WorkController(WorkService workService) {
        this.workService = workService;
    }

    @GetMapping("/fm")
    public String fm() {
        return "work/fm/main-finance";
    }

    @GetMapping("/fm/eform")
    public String eform() {
        return "work/fm/eform-finance";
    }
    @GetMapping("/fm/eform-draft")
    public String eformDraft() {

        return "file/eform-draft";
    }

    @GetMapping("/hr")
    public String hr() {
        return "work/hr/main-hr";
    }

    @GetMapping("/registerPage")
    public String registerPage() {
        return "work/hr/hr-register";
    }

    @GetMapping("/dev")
    public String dev(Model model) {
        return "work/dev/main-dev"; // 템플릿 파일 경로만 반환
    }

    @GetMapping("/dev/projects")
    @ResponseBody
    public ResponseEntity<List<ProjectDTO>> dev() {
        List<ProjectDTO> projectList = workService.getProjects();

        return ResponseEntity.ok(projectList);
    }



}

