package com.groupware.work.fm.controller;

import com.groupware.work.fm.dto.SalaryDTO;
import com.groupware.approval.dto.DeptTreeDTO;
import com.groupware.work.fm.service.FmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/fm")
public class FmController {

    private final FmService fmService;

    @Autowired
    public FmController(FmService fmService) {
        this.fmService = fmService;
    }

    @GetMapping("/departments")
    public List<DeptTreeDTO> getDepartments() {
        return fmService.getAllDepartments();
    }

    @GetMapping("/salariesByDepartment")
    public List<SalaryDTO> getSalariesByDepartment(@RequestParam("departmentId") int departmentId) {
        return fmService.getSalariesByDepartment(departmentId);
    }
}
