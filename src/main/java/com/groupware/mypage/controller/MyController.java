package com.groupware.mypage.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MyController {

    @GetMapping("/mypage")
    public String mypage() {
        return "mypage/main-mypage";
    }
}
