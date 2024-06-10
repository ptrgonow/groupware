package com.groupware.work.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WorkController {

@GetMapping("/work/FM")
public String main(){
    return "work/FM/main-finance";

@GetMapping("/hr")
public String hr() {
    return "work/hr/main-hr";
}

@GetMapping("/registerPage")
public String registerPage() {
    return "work/hr/hr-register";
}

}
}
