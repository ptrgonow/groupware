package com.groupware.approval.controller;

import com.groupware.approval.dto.ApDTO;
import com.groupware.approval.service.ApService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ApController {

    @GetMapping("/approval")
    public String approval() {
        return "/approval/main-approval";
    }

    @GetMapping("/approval-write")
    public String write() {
        return "/approval/approval-write";
    }
}
