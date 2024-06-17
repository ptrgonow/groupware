package com.groupware.work.controller;

import com.groupware.user.dto.UserDTO;
import com.groupware.user.service.UserService;
import com.groupware.work.dev.dto.ProjectDTO;
import com.groupware.work.dev.dto.ProjectDetailsDTO;
import com.groupware.work.dev.dto.ProjectMemberDTO;
import com.groupware.work.dev.dto.ProjectTaskDTO;
import com.groupware.work.dev.service.DevService;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@AllArgsConstructor
public class WorkViewController {

    private final DevService devService;
    private final UserService userService;

    @GetMapping("/fm")
    public String fm(Model model) {
        model.addAttribute("test", 120);
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
    public String dev(Model model, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");
        if (user == null) {
            return "redirect:/login"; // 로그인 페이지로 리다이렉트
        }
        List<ProjectDTO> projects = devService.getProjects(user.getEmployeeCode());

        model.addAttribute("user", user);
        model.addAttribute("projects", projects);

        return "work/dev/main-dev"; // 뷰 이름 반환
    }

}

