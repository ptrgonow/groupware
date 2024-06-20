package com.groupware.work.ceo.service;

import com.groupware.approval.dto.ApprovalDTO;
import com.groupware.work.ceo.mapper.CeoMapper;
import com.groupware.work.ms.dto.AllEmployeeDTO;
import com.groupware.work.ms.dto.MsApprovalDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CeoService {

    private final CeoMapper ceoMapper;

    @Autowired
    public CeoService (CeoMapper ceoMapper) {this.ceoMapper = ceoMapper;}

    public List<ApprovalDTO> getMyPendingApprovals(String employeeCode) {
        return ceoMapper.selectMyPendingApprovals(employeeCode);
    }

    // 모든 임직원 정보 조회 메서드 (예시로 추가된 메서드)
    public List<AllEmployeeDTO> getAllEmployees() {
        return ceoMapper.getAllEmployee();
    }




}
