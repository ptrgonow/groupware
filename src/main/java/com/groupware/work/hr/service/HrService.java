package com.groupware.work.hr.service;

import com.groupware.user.dto.UserDTO;
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
}
