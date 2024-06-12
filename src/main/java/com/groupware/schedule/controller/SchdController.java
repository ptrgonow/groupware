package com.groupware.schedule.controller;

import com.groupware.schedule.dto.SchdDTO;
import com.groupware.schedule.service.SchdService;
import com.groupware.user.dto.UserDTO;
import com.groupware.user.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/sc")
public class SchdController {

    private final SchdService schdService;

    @Autowired
    public SchdController(SchdService schdService) {
        this.schdService = schdService;
    }

    @GetMapping("/schedule")
    public String mainSchedule(Model model, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");
        if (user != null) {
            session.setAttribute("employeeCode", user.getEmployeeCode());
            session.setAttribute("departmentId", user.getDepartmentId());
            model.addAttribute("user", user);
        }
        return "schedule/main-schedule";
    }

    @GetMapping("/list")
    public ResponseEntity<List<SchdDTO>> getAllSchedules(HttpSession session) {
        String employeeCode = (String) session.getAttribute("employeeCode");
        if (employeeCode == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        List<SchdDTO> schedules = schdService.getAllSchedules(employeeCode);
        return new ResponseEntity<>(schedules, HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<String> createSchedule(@RequestBody SchdDTO schedule, HttpSession session) {
        String employeeCode = (String) session.getAttribute("employeeCode");
        if (employeeCode == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        if (schedule.getStartTime() == null) {
            return new ResponseEntity<>("Start time cannot be null", HttpStatus.BAD_REQUEST);
        }

        schedule.setEmployeeCode(employeeCode);
        schdService.createSchedule(schedule);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateSchedule(@PathVariable Long id, @RequestBody SchdDTO schedule, HttpSession session) {
        String employeeCode = (String) session.getAttribute("employeeCode");
        if (employeeCode == null) {
            return new ResponseEntity<>("권한 없음", HttpStatus.UNAUTHORIZED);
        }
        schedule.setEmployeeCode(employeeCode);
        schedule.setId(id);
        schdService.updateSchedule(schedule);
        return new ResponseEntity<>("일정 수정 성공", HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteSchedule(@PathVariable Long id) {
        schdService.deleteSchedule(id);
        return new ResponseEntity<>("일정 삭제 성공", HttpStatus.NO_CONTENT);
    }
}
