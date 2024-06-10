package com.groupware.attendance.service;

import com.groupware.attendance.dto.AttDTO;
import com.groupware.attendance.mapper.AttMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AttService {

    private final AttMapper attMapper;

    public AttService(AttMapper attMapper) {
        this.attMapper = attMapper;
    }

    public void startAttendance(AttDTO attDTO) {
        Optional<AttDTO> latestAttendance = attMapper.getAttendanceStatus(attDTO.getEmployeeCode());
        if (latestAttendance.isPresent() && latestAttendance.get().getCheckOut() == null) {
            throw new IllegalStateException("이미 출근 상태입니다.");
        }
        attMapper.insertCheckIn(attDTO);
    }

    public void endAttendance(AttDTO attDTO) {
        Optional<AttDTO> latestAttendance = attMapper.getAttendanceStatus(attDTO.getEmployeeCode());
        if (latestAttendance.isEmpty() || latestAttendance.get().getCheckOut() != null) {
            throw new IllegalStateException("출근 기록이 없거나 이미 퇴근 상태입니다.");
        }
        attMapper.updateCheckOut(attDTO);
    }

    public Optional<AttDTO> getAttendanceStatus(String employeeCode) {
        return attMapper.getAttendanceStatus(employeeCode);
    }

    public List<AttDTO> getAttendanceRecords(String employeeCode) {
        return attMapper.getAttendanceRecords(employeeCode);
    }
}
