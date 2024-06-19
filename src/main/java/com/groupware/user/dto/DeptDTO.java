package com.groupware.user.dto;

import lombok.Data;

@Data
public class DeptDTO {

    private int departmentId;
    private String departmentName;
    private Integer parentDepartmentId;
}
