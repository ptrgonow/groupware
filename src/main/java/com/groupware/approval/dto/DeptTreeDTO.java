package com.groupware.approval.dto;

import lombok.Data;

@Data
public class DeptTreeDTO {

    private int departmentId;
    private String departmentName;
    private Integer parentDepartmentId;
    private String managerEmpCode;
}
