package com.groupware.schedule.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/sc")
public class SchdController {

    @GetMapping("/schedule")
    public String mainSchedule() {
        return "schedule/main-schedule";
    }

}
