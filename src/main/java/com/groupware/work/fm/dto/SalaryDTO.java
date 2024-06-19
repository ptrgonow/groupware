package com.groupware.work.fm.dto;

import lombok.Data;
import java.util.Date;

@Data
public class SalaryDTO {
    private int salaryId;
    private String employeeCode;
    private String description;
    private double amount;
    private Date hireDate;
    private String departmentName;
    private String positionName;
}