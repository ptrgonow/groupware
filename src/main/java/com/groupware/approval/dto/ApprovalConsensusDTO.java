package com.groupware.approval.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ApprovalConsensusDTO {

    private int consensusId;
    private int approvalId;
    private String employeeCode;
    private String employeeName;
    private String departmentName;
    private String status;
    private Date createdAt;
}
