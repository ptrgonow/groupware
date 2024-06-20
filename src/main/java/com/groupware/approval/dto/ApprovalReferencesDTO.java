package com.groupware.approval.dto;

import lombok.Data;

@Data
public class ApprovalReferencesDTO {

    private int referenceId;
    private int approvalId;
    private String employeeCode;
    private String employeeName;
    private String departmentName;
}
