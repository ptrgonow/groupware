package com.groupware.mypage.controller;

import com.groupware.attendance.dto.AttDTO;
import com.groupware.attendance.service.AttService;
import com.groupware.mypage.dto.TodoDTO;
import com.groupware.mypage.service.MyService;
import com.groupware.user.dto.UserDTO;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/mypage")
public class MyController {

    private static final Logger logger = LoggerFactory.getLogger(MyController.class);

    private final AttService attService;
    private final MyService myService;

    public MyController(AttService attService, MyService myService) {
        this.attService = attService;
        this.myService = myService;
    }

    @GetMapping("/myinfo")
    public String myPage(Model model, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");
        model.addAttribute("user", user);
        model.addAttribute("holiday", myService.getHolidayList(user.getEmployeeCode()));
        List<AttDTO> workRecords = attService.workTimeCal(user.getEmployeeCode());
        model.addAttribute("workRecord", workRecords);

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
            List<TodoDTO> todoList = myService.getTodoList(user.getEmployeeCode());
            response.put("success", true);
            response.put("todoList", todoList);
        } else {
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
            response = new HashMap<>();
            response.put("success", false);
            response.put("message", "할 일을 추가하는 데 실패했습니다.");
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/update")
    public ResponseEntity<Map<String, Object>> updateTodo(@RequestParam("todoId") int todoId,
                                                          @RequestParam("content") String content) {
        Map<String, Object> response;

        try {
            TodoDTO todo = new TodoDTO();
            todo.setTodoId(todoId);
            todo.setContent(content);
            response = myService.updateTodoList(todo);

        } catch (Exception e) {
            logger.error("Error updating todo", e);
            response = new HashMap<>();
            response.put("success", false);
            response.put("message", "할 일을 수정하는 데 실패했습니다.");
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/updateStatus")
    public ResponseEntity<Map<String, Object>> updateTodoStatus(@RequestParam("todoId") int todoId,
                                                                @RequestParam("completed") boolean completed) {
        boolean isUpdated = myService.updateTodoStatus(todoId, completed);
        Map<String, Object> response = new HashMap<>();
        response.put("success", isUpdated);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/delete")
    public ResponseEntity<Map<String, Object>> deleteTodo(@RequestParam("todoId") int todoId) {
        boolean isDeleted = myService.deleteTodoList(todoId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", isDeleted);
        return ResponseEntity.ok(response);
    }

}
