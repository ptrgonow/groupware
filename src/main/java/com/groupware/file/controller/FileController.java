package com.groupware.file.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FileController {

    @GetMapping("/file")
    public String file() {
        return "file/main-file";
    }

    @GetMapping("/file-vac")
    public String vac() {
        return "file/eform-draft";
    }
}
