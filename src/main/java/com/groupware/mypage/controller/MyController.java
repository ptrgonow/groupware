package com.groupware.mypage.controller;

import com.groupware.user.dto.UserDTO;
import com.groupware.user.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MyController {

    private final UserService userService;

    public MyController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/mypage")
    public String myPage(Model model, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");
        if (user != null) {
            user = userService.getUserDetails(user.getEmployeeCode());
            model.addAttribute("user", user);
        }
        return "mypage/main-mypage";
    }


}
