package com.groupware.user.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/loginPage")
    public String loginPage() {
        return "/include/popup/login";
    }
}
