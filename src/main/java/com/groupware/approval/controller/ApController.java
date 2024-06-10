package com.groupware.approval.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ApController {

    @GetMapping("/approval")
    public String approval() {
        return "/approval/main-approval";
    }

    @GetMapping("/approval-write")
    public String approvalWrite() {
        return "/approval/approval-write";
    }
}
