package com.groupware.work.fm.controller;

import com.groupware.approval.dto.ApprovalDTO;
import com.groupware.work.fm.dto.SalaryDTO;
import com.groupware.approval.dto.DeptTreeDTO;
import com.groupware.work.fm.dto.FixedExpensesDTO;
import com.groupware.work.fm.service.FmService;
import org.springframework.beans.factory.annotation.Autowired;
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
    @GetMapping("/fixedExpenses")
    public List<FixedExpensesDTO> getFixedExpenses() {
        return fmService.getFixedExpenses();
    }
    @GetMapping("/completedFixedExpenses")
    public List<FixedExpensesDTO> getCompletedFixedExpenses(@RequestParam String fileCd) {
        return fmService.getCompletedFixedExpenses(fileCd);
    }


    /* SALARY BY DEPARTMENT */
    @GetMapping("/departments")
    public List<DeptTreeDTO> getDepartments() {
        return fmService.getAllDepartments();
    }
    @GetMapping("/salariesByDepartment")
    public ResponseEntity<List<SalaryDTO>> getSalariesByDepartment(@RequestParam int departmentId) {
        List<SalaryDTO> salaries = fmService.getSalariesByDepartment(departmentId);
        return ResponseEntity.ok(salaries);
    }


    /* PASSWORD TO VIEW SALARY INFO */
    @PostMapping("/authenticate")
    public boolean authenticate(@RequestParam String password) {
        return fmService.authenticate(password);
    }
}
