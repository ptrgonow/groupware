package com.groupware.work.fm.dto;

import lombok.Data;

@Data
public class DepartmentDTO {
    private int departmentId;
    private String departmentName;
    private Integer parentDepartmentId;
    private String managerEmpCode;
}