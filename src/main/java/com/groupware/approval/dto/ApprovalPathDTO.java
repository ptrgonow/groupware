package com.groupware.approval.dto;

import lombok.Data;

@Data
public class ApprovalPathDTO {

    private int pathId;
    private int approvalId;
    private String employeeCode;
    private String employeeName;
    private String departmentName;
    private int sequence;
    private String status;
    private String fileCd;
}
