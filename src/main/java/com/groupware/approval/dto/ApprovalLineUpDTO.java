package com.groupware.approval.dto;

import lombok.Data;

@Data
public class ApprovalLineUpDTO {

    private int approvalId;
    private String employeeCode;
    private String newStatus;
}
