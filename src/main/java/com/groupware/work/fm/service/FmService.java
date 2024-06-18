package com.groupware.work.fm.service;

import com.groupware.work.fm.dto.SalaryDTO;
import com.groupware.approval.dto.DeptTreeDTO;
import com.groupware.work.fm.mapper.FmMapper; // 패키지 경로를 올바르게 수정
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FmService {

    private final FmMapper fmMapper;

    @Autowired
    public FmService(FmMapper fmMapper) {
        this.fmMapper = fmMapper;
    }

    public List<DeptTreeDTO> getAllDepartments() {
        return fmMapper.getDepartments();
    }

    public List<SalaryDTO> getSalariesByDepartment(int departmentId) {
        return fmMapper.getSalariesByDepartment(departmentId);
    }
}
