package com.groupware.approval.service;

import com.groupware.approval.dto.DeptTreeDTO;
import com.groupware.approval.dto.EmployeeDTO;
import com.groupware.approval.dto.PositionsDTO;
import com.groupware.approval.mapper.ApMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ApService {

    private final ApMapper apMapper;

    public List<EmployeeDTO> getEmployeeList() {
        return apMapper.selectAll();
    }

    public List<DeptTreeDTO> getDeptList() {
        return apMapper.selectAllDepartment();
    }

    public List<PositionsDTO> getPositionList() {
        return apMapper.selectAllPositions();
    }

}
