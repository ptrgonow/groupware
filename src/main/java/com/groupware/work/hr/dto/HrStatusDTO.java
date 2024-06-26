package com.groupware.work.hr.dto;

import lombok.Data;

import java.util.Date;

@Data
public class HrStatusDTO {

    private String employeeCode;
    private String checkIn;
    private String checkOut;
    private String status;
    private Date createdAt;

}
