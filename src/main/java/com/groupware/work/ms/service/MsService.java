package com.groupware.work.ms.service;

import com.groupware.work.ms.dto.AllEmployeeDTO;
import com.groupware.work.ms.dto.MsApprovalDTO;
import com.groupware.work.ms.mapper.MsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MsService {

    private final MsMapper msMapper;

    @Autowired
    public MsService(MsMapper msMapper) {
        this.msMapper = msMapper;
    }

    public List<AllEmployeeDTO> getAllEmployees() {
        return msMapper.getAllEmployee();
    }

    public List<MsApprovalDTO> getAllApprovals() {
        return msMapper.getApproval();
    }

    public List<MsApprovalDTO> getFmApproval(){
        return msMapper.getFmApproval();
    }

    public List<MsApprovalDTO> getNewApproval(){
        return msMapper.getNewApproval();
    }
}
