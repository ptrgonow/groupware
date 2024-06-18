package com.groupware.work.hr.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class HrEmployeeDTO {

    private String employeeCode;
    private String name;
    private String departmentName;
    private int departmentId;
    private String psCd;
    private String psNm;

}
