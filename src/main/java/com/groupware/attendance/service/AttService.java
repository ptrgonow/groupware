package com.groupware.attendance.service;

import com.groupware.attendance.dto.AttDTO;
import com.groupware.attendance.mapper.AttMapper;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class AttService {

    private final AttMapper attMapper;

    public AttService(AttMapper attMapper) {
        this.attMapper = attMapper;
    }

    public void startAttendance(AttDTO attDTO) {
        // 로그 추가
        System.out.println("시작 - 출근 처리: " + attDTO.getEmployeeCode());

        Optional<AttDTO> latestAttendance = attMapper.getAttendanceStatus(attDTO.getEmployeeCode());

        // 가장 최근 출근 기록이 있고, 아직 퇴근하지 않은 상태인 경우
        if (latestAttendance.isPresent() && latestAttendance.get().getCheckOut() == null) {
            System.out.println("오류 - 이미 출근 상태입니다: " + attDTO.getEmployeeCode());
            throw new IllegalStateException("이미 출근 상태입니다.");
        }

        // 새로운 출근 기록 삽입
        attMapper.insertCheckIn(attDTO);
        System.out.println("완료 - 출근 처리: " + attDTO.getEmployeeCode());
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

    public List<AttDTO> workTimeCal(String employeeCode) {
        List<AttDTO> records = attMapper.getFirstAndLastAttendance(employeeCode);

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");

        for (AttDTO attDTO : records) {
            if (attDTO == null) {
                System.out.println("attDTO is null in the records list.");
                continue;
            }

            LocalDateTime firstCheckIn = attDTO.getFirstCheckIn();
            LocalDateTime lastCheckOut = attDTO.getLastCheckOut();

            if (firstCheckIn != null && lastCheckOut != null) {
                Duration duration = Duration.between(firstCheckIn, lastCheckOut);
                long hours = duration.toHours();
                long minutes = duration.toMinutes() % 60;

                attDTO.setHoursWorked(hours);
                attDTO.setMinutesWorked(minutes);
                System.out.println("Calculated work time for " + employeeCode + ": " + hours + " hours " + minutes + " minutes");
            } else {
                System.out.println("First check-in or last check-out is null for " + employeeCode);
                attDTO.setHoursWorked(0);
                attDTO.setMinutesWorked(0);
            }

            if (attDTO.getAttendanceDate() != null) {
                attDTO.setFormattedAttendanceDate(attDTO.getAttendanceDate().format(dateFormatter));
            }
            if (firstCheckIn != null) {
                attDTO.setFormattedFirstCheckIn(firstCheckIn.format(timeFormatter));
            }
            if (lastCheckOut != null) {
                attDTO.setFormattedLastCheckOut(lastCheckOut.format(timeFormatter));
            }
        }

        return records;
    }
}

