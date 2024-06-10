package com.groupware.work.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WorkController {

@GetMapping("/FM")
public String main() {
    return "work/FM/main-finance";
}
@GetMapping("/FM/eform")
    public String eform() {
    return "work/FM/eform-finance";
    }
@GetMapping("/FM/eform-draft")
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

}

