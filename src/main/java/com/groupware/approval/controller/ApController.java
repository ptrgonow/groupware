package com.groupware.approval.controller;


import com.groupware.user.dto.UserDTO;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping("/ap")
public class ApController {

    @GetMapping("/aMain")
    public String approval(Model model, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");

        if(user != null) {
            model.addAttribute("user", user);
            return "/approval/main-approval";
        }
        return "redirect:/loginPage";
    }

    @GetMapping("/write")
    public String write(Model model, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");

        if(user != null) {
            model.addAttribute("user", user);
            return "/approval/approval-form";
        }
        return "redirect:/loginPage";
    }


}
