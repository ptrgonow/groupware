package com.groupware.user.controller;

import com.groupware.user.dto.UserDTO;
import com.groupware.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/info")
    public ResponseEntity<UserDTO> getUserInfo(@RequestParam String employee_code) {
        UserDTO user = userService.getUserInfo(employee_code);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserDTO user) {
        if (userService.registerUser(user)) {
            return ResponseEntity.ok("유저 등록 성공");
        } else {
            return ResponseEntity.badRequest().body("유저 등록 실패");
        }
    }

}
