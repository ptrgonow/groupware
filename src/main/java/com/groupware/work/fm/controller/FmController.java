package com.groupware.work.fm.controller;

import com.groupware.work.fm.dto.SalaryDTO;
import com.groupware.approval.dto.DeptTreeDTO;
import com.groupware.work.fm.service.FmService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fm")
public class FmController {

    private final FmService fmService;

    @Autowired
    public FmController(FmService fmService) {
        this.fmService = fmService;
    }

    /* FIXED EXPENSE */

    /* SALARY BY DEPARTMENT */
    @GetMapping("/departments")
    public List<DeptTreeDTO> getDepartments() {
        return fmService.getAllDepartments();
    }
    @GetMapping("/salariesByDepartment")
    public List<SalaryDTO> getSalariesByDepartment(@RequestParam("departmentId") int departmentId) {
        return fmService.getSalariesByDepartment(departmentId);
    }

    /* PASSWORD TO VIEW SALARY INFO */
    @PostMapping("/authenticate")
    public boolean authenticate(@RequestParam String password) {
        return fmService.authenticate(password);
    }
}
