package com.groupware.work.hr.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TodayWorkerDTO {

    private int id;
    private String name;
    private String employeeCode;
    private LocalDateTime firstCheckIn;
    private LocalDateTime checkOut;
    private String status;
    private String createdAt;

}
