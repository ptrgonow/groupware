package com.groupware.mypage.controller;

import com.groupware.mypage.dto.TodoDTO;
import com.groupware.mypage.service.MyService;
import com.groupware.user.dto.UserDTO;
import com.groupware.user.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger logger = LoggerFactory.getLogger(MyController.class);

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
            logger.info("User {} accessed myinfo page. Session ID: {}", user.getUsername(), session.getId());
            user = userService.getUserDetails(user.getEmployeeCode());
            model.addAttribute("user", user);
        } else {
            logger.info("No user found in session for myinfo page access. Redirecting to login.");
            return "redirect:/loginPage";
        }
        return "mypage/main-mypage";
    }

    @GetMapping("/todo")
    public String todoPage() {
        return "mypage/todo";
    }


    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getTodoList(HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");
        Map<String, Object> response = new HashMap<>();
        if (user != null) {
            logger.info("User {} accessed todo page. Session ID: {}", user.getUsername(), session.getId());
            List<TodoDTO> todoList = myService.getTodoList(user.getEmployeeCode());
            response.put("success", true);
            response.put("todoList", todoList);
        } else {
            logger.info("No user found in session for todo page access.");
            response.put("success", false);
            response.put("message", "로그인이 필요합니다.");
        }
        return ResponseEntity.ok(response);
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
            logger.error("Error adding todo", e);
            response = new HashMap<>();
            response.put("success", false);
            response.put("message", "할 일을 추가하는 데 실패했습니다.");
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/delete")
    public ResponseEntity<Map<String, Object>> deleteTodo(@RequestParam("todoId") int todoId) {
        boolean isDeleted = myService.deleteTodoList(todoId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", isDeleted);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/holiday")
    public String holidayPage(Model model, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");
        if (user != null) {
            logger.info("User {} accessed holiday page. Session ID: {}", user.getUsername(), session.getId());
            model.addAttribute("user", user);
            model.addAttribute("holiday", myService.getHolidayList(user.getEmployeeCode()));
        } else {
            logger.info("No user found in session for holiday page access. Redirecting to login.");
            return "redirect:/loginPage";
        }
        return "mypage/holiday";
    }
}
