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
        List<HrEmplMagDTO> nowStatus = hrMapper.getEmplManagement();

        if(nowStatus != null){
            for(HrEmplMagDTO allStatus : nowStatus){
                if(allStatus.getStatus() == null){
                    allStatus.setStatus("퇴근");
                }
            }
        }
        return nowStatus;
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
    public Map<String, String> updateStatus(String employeeCode, String status) {
        Map<String, String> response = new HashMap<>();
        HrStatusDTO currentStatusDTO = hrMapper.getEmpStatusByCode(employeeCode);
        if (currentStatusDTO != null) {
            String currentStatus = currentStatusDTO.getStatus();
            if ("근무중".equals(currentStatus) && "휴가".equals(status)) {
                response.put("error", "check_out_first");
            } else if ("휴가".equals(currentStatus) && "퇴근".equals(status)) {
                response.put("error", "no_check_in");
            } else {
                if ("근무중".equals(status)) {
                    hrMapper.insertCheckIn(employeeCode);
                } else if ("퇴근".equals(status)) {
                    hrMapper.updateCheckOut(employeeCode);
                } else if ("휴가".equals(status)) {
                    hrMapper.insertVacation(employeeCode);
                }
                response.put("success", "true");
            }
        } else {
            response.put("error", "not_found");
        }
        return response;
    }

    public HrStatusDTO getEmpStatusByCode(String employeeCode) {
        return hrMapper.getEmpStatusByCode(employeeCode);
    }

    public List<HrEmplMagDTO> searchUsers(String search) {
        return hrMapper.searchUsers(search);
    }

}
