package com.groupware.work.hr.service;

import com.groupware.work.hr.dto.HrEmplMagDTO;
import com.groupware.work.hr.dto.HrEmployeeDTO;
import com.groupware.work.hr.dto.TodayWorkerDTO;
import com.groupware.work.hr.mapper.HrMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HrService {

    private final HrMapper hrMapper;

    @Autowired
    public HrService(HrMapper hrMapper) {
        this.hrMapper = hrMapper;
    }

    public int AllEmployeeCount(){
        return hrMapper.AllEmployeeCount();
    }

    public List<HrEmployeeDTO> getAllEmployees() {
        return hrMapper.getAllEmployees();
    }

    public int AllApprovalCount(){
        return hrMapper.AllApprovalCount();
    }

    public List<TodayWorkerDTO> getAllTodayWorkers() {
        return hrMapper.getTodayWorkers();
    }

    public List<HrEmployeeDTO> getManagerEmployee() {
        return hrMapper.getManagerEmployee();
    }

    public List<HrEmplMagDTO> getEmplManagement() {
        List<HrEmplMagDTO> status = hrMapper.getEmplManagement();
        // 'status'가 null인 경우 '출근전'으로 대체
        for (HrEmplMagDTO empstatus : status) {
            if (empstatus.getStatus() == null) {
                empstatus.setStatus("퇴근");
            }
        }
        return status;
    }

    public HrEmplMagDTO getEmplInfo(String employeeCode){
        return hrMapper.getEmplInfo(employeeCode);
    }

    public List<String> getDepartments() {
        return hrMapper.getDepartments();
    }

    public List<String> getPositions() {
        return hrMapper.getPositions();
    }

    public List<String> getStatuses() {
        return hrMapper.getStatuses();
    }

    public void deleteEmployeeByCode(String employeeCode){
        hrMapper.deleteEmployeeByCode(employeeCode);
    }

}
