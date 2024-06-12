package com.groupware.work.controller;

import com.groupware.user.dto.UserDTO;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WorkController {

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
    public String dev(Model model, HttpSession session) {

        UserDTO user = (UserDTO) session.getAttribute("user");
        model.addAttribute("employeeCode", user.getEmployeeCode());

        return "work/dev/main-dev";
    }



}

