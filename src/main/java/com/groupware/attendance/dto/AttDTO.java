package com.groupware.attendance.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AttDTO {

    private String employeeCode;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private String status;
    private LocalDateTime createdAt;

}
