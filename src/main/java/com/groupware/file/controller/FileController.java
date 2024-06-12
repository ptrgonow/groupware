package com.groupware.file.controller;

import com.groupware.user.dto.UserDTO;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/file")
public class FileController {

    @GetMapping("/fmain")
    public String file(Model model, HttpSession session) {

        UserDTO user = (UserDTO) session.getAttribute("user");

        if (user != null) {
            model.addAttribute("user", user);
            model.addAttribute("departmentName", user.getDepartmentName());
        }

        return "file/main-file";
    }

    @GetMapping("/vac")
    public String vac() {
        return "file/eform-draft";
    }





}
