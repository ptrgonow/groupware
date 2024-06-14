package com.groupware.approval.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class EmployeeDTO {
    private String employeeCode;
    private String name;
    private Date birthDate;
    private String address;
    private Integer departmentId;
    private String psCd;
    private String status;
    private Date hiredate;
    private String username;
    private String password;
}
