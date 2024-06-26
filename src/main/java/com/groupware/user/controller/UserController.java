package com.groupware.user.controller;

import com.groupware.user.dto.DeptDTO;
import com.groupware.user.dto.PositionDTO;
import com.groupware.user.dto.UserDTO;
import com.groupware.user.dto.UserUpdateDTO;
import com.groupware.user.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/info")
    public ResponseEntity<UserDTO> getUserInfo(@RequestParam String employeeCode) {
        UserDTO user = userService.getUserDetails(employeeCode);
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
                                                            @RequestParam("detailAddress") String detailAddress,
                                                            @RequestParam("extraAddress") String extraAddress,
                                                            @RequestParam("department_id") int departmentId,
                                                            @RequestParam("ps_cd") String position,
                                                            @RequestParam("username") String username,
                                                            @RequestParam("password") String password) {
        UserDTO user = new UserDTO();
        user.setEmployeeCode(employeeCode);
        user.setName(name);
        user.setBirthDate(birthDate);
        user.setAddress(address);
        user.setDetailAddress(detailAddress);
        user.setExtraAddress(extraAddress);
        user.setDepartmentId(departmentId);
        user.setPs_cd(position);
        user.setUsername(username);
        user.setPassword(password);

        Map<String, String> response = new HashMap<>();
        if (userService.registerUser(user)) {
            response.put("message", "유저 등록 성공");
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

    @GetMapping("/positions")
    public ResponseEntity<List<PositionDTO>> getAllPositions() {
        List<PositionDTO> positions = userService.getAllPositions();
        return ResponseEntity.ok(positions);
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
            logger.info("Login failed for username: {}", username);
            response.put("message", "로그인 실패");
            return ResponseEntity.badRequest().body(response);
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        if (session == null || session.getAttribute("user") == null) {
            return ResponseEntity.status(401).body("세션 정보가 없습니다. 로그인 해주세요.");
        }

        session.invalidate();
        return ResponseEntity.ok("로그아웃 성공");
    }

    @GetMapping("/dInfo")
    public ResponseEntity<Map<String, Object>> getUserDepartmentInfo(HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");
        Map<String, Object> response = new HashMap<>();

        if (user != null) {
            response.put("departmentId", user.getDepartmentId());
            response.put("departmentName", user.getDepartmentName());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @PostMapping("/update")
    public ResponseEntity<Map<String, String>> updateUser(
            @RequestParam("employee_code") String employeeCode,
            @RequestParam("birth_date") String birthDate,
            @RequestParam("address") String address,
            @RequestParam("detailAddress") String detailAddress,
            @RequestParam("extraAddress") String extraAddress,
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            HttpSession session) {

        UserUpdateDTO user = new UserUpdateDTO();
        user.setEmployeeCode(employeeCode);
        user.setBirthDate(birthDate);
        user.setAddress(address);
        user.setDetailAddress(detailAddress);
        user.setExtraAddress(extraAddress);
        user.setUsername(username);
        user.setPassword(password);

        boolean updateSuccess = userService.updateUser(user);

        Map<String, String> response = new HashMap<>();
        if (updateSuccess) {

            UserDTO newSessionUser = userService.getUserDetails(employeeCode);
            // 세션 업데이트
            session.setAttribute("user", newSessionUser);
            response.put("message", "업데이트 성공");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "업데이트 실패");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }



}
