package com.groupware.work.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WorkController {

    @GetMapping("/hr")
    public String hr() {return "work/hr/main-hr";}
}
