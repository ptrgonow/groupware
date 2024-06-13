package com.groupware.work.fm.dto;

import lombok.Data;
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
    private Date createdAt;
    private String username;
    private String password;
}