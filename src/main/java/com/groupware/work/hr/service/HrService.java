package com.groupware.work.hr.service;

import com.groupware.work.hr.dto.*;
import com.groupware.work.hr.mapper.HrMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        return status;
    }

    public List<HrStatusDTO> getEmpStatus(){
        return hrMapper.getEmpStatus();
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

    public List<String> empStatues(){
        return hrMapper.empStatues();
    }

    public void deleteEmployeeByCode(String employeeCode){
        hrMapper.deleteEmployeeByCode(employeeCode);
    }

    @Transactional
    public void updateEmployeeDetails(HrEmployeeUpdateDTO employeeUpdateDTO) {
        // 사원 정보 업데이트
        hrMapper.updateEmployee(employeeUpdateDTO);

    }



}
