package com.groupware.approval.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
public class ApprovalDTO {

    private int approvalId;
    private String employeeCode;
    private String fileCd;
    private String content;
    private String status;
    private Date createdAt;
    private Date duedateAt;
}
