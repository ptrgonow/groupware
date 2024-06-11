package com.groupware.work.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WorkController {

    @GetMapping("/fm")
    public String main() {
        return "work/FM/main-finance";
    }

    @GetMapping("/fm/eform")
    public String eform() {
        return "work/FM/eform-finance";
    }
    @GetMapping("/fm/eform-draft")
    public String eformDraft() {
        return "work/FM/eform-draft";
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
    public String dev() {
        return "work/dev/main-dev";
    }

}

