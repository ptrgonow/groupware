package com.groupware.attendance.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class AttDTO {

    private String employeeCode;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime firstCheckIn;
    private LocalDateTime lastCheckOut;
    private long hoursWorked;
    private long minutesWorked;
    private LocalDate attendanceDate;

    private String formattedAttendanceDate;
    private String formattedFirstCheckIn;
    private String formattedLastCheckOut;

}
