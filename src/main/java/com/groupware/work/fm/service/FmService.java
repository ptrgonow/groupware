package com.groupware.work.fm.service;

import com.groupware.work.fm.dto.SalaryDTO;
import com.groupware.approval.dto.DeptTreeDTO;
import com.groupware.work.fm.mapper.FmMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FmService {

    private final FmMapper fmMapper;

    @Autowired
    public FmService(FmMapper fmMapper) {
        this.fmMapper = fmMapper;
    }

    /* FIXED EXPENSE */

    /* SALARY BY DEPARTMENT */
    public List<DeptTreeDTO> getAllDepartments() {
        return fmMapper.getDepartments();
    }

    public List<SalaryDTO> getSalariesByDepartment(int departmentId) {
        return fmMapper.getSalariesByDepartment(departmentId);
    }

    /* PASSWORD TO VIEW SALARY INFO */
    /* PASSWORD TO VIEW SALARY INFO */
    public boolean authenticate(String password) {
        return "123".equals(password);
    }
}