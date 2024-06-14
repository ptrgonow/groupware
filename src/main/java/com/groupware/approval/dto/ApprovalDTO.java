package com.groupware.approval.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class ApprovalDTO {
    private int approvalId;
    private String employeeCode;
    private String documentName;
    private String content;
    private String status;
    private LocalDateTime createdAt;
}
