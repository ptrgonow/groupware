package com.groupware.mypage.controller;

import com.groupware.mypage.dto.TodoDTO;
import com.groupware.mypage.service.MyService;
import com.groupware.user.dto.UserDTO;
import com.groupware.user.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/mypage")
public class MyController {

    private final UserService userService;
    private final MyService myService;

    public MyController(UserService userService, MyService myService) {
        this.userService = userService;
        this.myService = myService;
    }

    @GetMapping("/myinfo")
    public String myPage(Model model, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");
        if (user != null) {
            user = userService.getUserDetails(user.getEmployeeCode());
            model.addAttribute("user", user);
        }
        return "mypage/main-mypage";
    }

    @GetMapping("/todo")
    public String todoPage(Model model, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");
        if (user != null) {
            List<TodoDTO> todoList = myService.getTodoList(user.getEmployeeCode());
            model.addAttribute("todoList", todoList);
        }
        return "mypage/todo";
    }

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addTodo(@RequestParam("content") String content,
                                                       @RequestParam("employeeCode") String employeeCode) {
        Map<String, Object> response;
        try {
            TodoDTO todo = new TodoDTO();
            todo.setContent(content);
            todo.setEmployeeCode(employeeCode);

            response = myService.addTodoList(todo);
        } catch (Exception e) {
            response = new HashMap<>();
            response.put("success", false);
            response.put("message", "할 일을 추가하는 데 실패했습니다.");
        }
        return ResponseEntity.ok(response);
    }
}

