package com.groupware.user.controller;

import com.groupware.user.dto.DeptDTO;
import com.groupware.user.dto.UserDTO;
import com.groupware.user.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public ResponseEntity<Map<String, String>> registerUser(@RequestParam("employee_code") String employeeCode,
                                                            @RequestParam("name") String name,
                                                            @RequestParam("birth_date") String birthDate,
                                                            @RequestParam("address") String address,
                                                            @RequestParam("department_id") int departmentId,
                                                            @RequestParam("position") String position,
                                                            @RequestParam("username") String username,
                                                            @RequestParam("password") String password) {
        UserDTO user = new UserDTO();
        user.setEmployeeCode(employeeCode);
        user.setName(name);
        user.setBirthDate(birthDate);
        user.setAddress(address);
        user.setDepartmentId(departmentId);
        user.setPosition(position);
        user.setUsername(username);
        user.setPassword(password);

        Map<String, String> response = new HashMap<>();
        if (userService.registerUser(user)) {
            response.put("message", "유저 등록 성공");
            response.put("redirectUrl", "/success-page"); // 리다이렉트할 URL
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "유저 등록 실패");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/dept")
    public ResponseEntity<List<DeptDTO>> getAllDepartments() {
        List<DeptDTO> departments = userService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestParam("username") String username,
                                                     @RequestParam("password") String password,
                                                     HttpSession session) {
        UserDTO user = userService.authenticate(username, password);
        Map<String, String> response = new HashMap<>();
        if (user != null) {
            session.setAttribute("user", user);
            response.put("message", "로그인 성공");
            response.put("username", user.getName());
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "로그인 실패");
            return ResponseEntity.badRequest().body(response);
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("로그아웃 성공");
    }

}
