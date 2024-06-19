package com.groupware.schedule.service;

import com.groupware.schedule.dto.SchdDTO;
import com.groupware.schedule.mapper.SchdMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchdService {

    private final SchdMapper schdMapper;

    public SchdService(SchdMapper schdMapper) {
        this.schdMapper = schdMapper;
    }

    public List<SchdDTO> getAllSchedules(String employeeCode) {
        return schdMapper.getAllSchedules(employeeCode);
    }

    public void createSchedule(SchdDTO schedule) {
        // 디버깅 로그 추가
        System.out.println("Creating Schedule: " + schedule);
        schdMapper.createSchedule(schedule);
    }

    public void updateSchedule(SchdDTO schedule) {
        schdMapper.updateSchedule(schedule);
    }

    public void deleteSchedule(Long id) {
        schdMapper.deleteSchedule(id);
    }
}
