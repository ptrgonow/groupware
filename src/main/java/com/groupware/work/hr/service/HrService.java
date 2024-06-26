package com.groupware.work.hr.service;

import com.groupware.work.hr.dto.*;
import com.groupware.work.hr.mapper.HrMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    public int HrApprovalCount(){
        return hrMapper.HrApprovalCount();
    }

    public List<TodayWorkerDTO> getAllTodayWorkers() {
        return hrMapper.getTodayWorkers();
    }

    public List<HrEmployeeDTO> getManagerEmployee() {
        return hrMapper.getManagerEmployee();
    }

    public List<HrEmplMagDTO> getEmplManagement() {
        return hrMapper.getEmplManagement();
    }

    public List<HrStatusDTO> getEmpStatus(){
        List<HrStatusDTO> status = hrMapper.getEmpStatus();

        if (status != null) {
            for (HrStatusDTO empStatus : status) {
                if (empStatus.getStatus() == null) {
                    empStatus.setStatus("퇴근");
                }
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

    public Map<String, Integer> getStatusCounts() {
        List<HrStatusDTO> statuses = hrMapper.empStatues();
        int vacationCount = 0;
        int workingCount = 0;

        for (HrStatusDTO status : statuses) {
            if ("휴가".equals(status.getStatus())) {
                vacationCount++;
            } else if ("근무중".equals(status.getStatus())) {
                workingCount++;
            }
        }

        Map<String, Integer> statusCounts = new HashMap<>();
        statusCounts.put("휴가", vacationCount);
        statusCounts.put("근무중", workingCount);
        return statusCounts;
    }

    public List<HrApprovalDTO> getHrApproval() {
        return hrMapper.getHrApproval();
    }

    @Transactional
    public boolean deleteEmployee(String employeeCode) {
        // attendance 테이블에서 해당 employee_code 레코드 삭제
        hrMapper.deleteAttendanceByEmployeeCode(employeeCode);
        // employee 테이블에서 해당 employee_code 레코드 삭제
        hrMapper.deleteEmployeeByCode(employeeCode);
        return true;
    }

    @Transactional
    public Map<String, Object> updateEmployeeDetails(HrEmployeeUpdateDTO employeeUpdateDTO) {
        Map<String, Object> result = new HashMap<>();
        try {
            hrMapper.updateEmployeeDetails(employeeUpdateDTO);
            result.put("success", true);
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
        }
        return result;
    }


    @Transactional
    public boolean updateStatus(String employeeCode, String status) {
        int count = hrMapper.countByEmployeeCode(employeeCode);
        if (count > 0) {
            if ("근무중".equals(status)) {
                hrMapper.insertCheckIn(employeeCode);
            } else if ("퇴근".equals(status)) {
                hrMapper.updateCheckOut(employeeCode);
            } else if ("휴가".equals(status)) {
                hrMapper.insertVacation(employeeCode);
            }
            return true;
        } else {
            return false;
        }
    }

    public List<HrEmplMagDTO> searchUsers(String search) {
        return hrMapper.searchUsers(search);
    }

}
