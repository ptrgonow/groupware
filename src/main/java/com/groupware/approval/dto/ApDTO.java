package com.groupware.approval.dto;

import lombok.Data;

@Data
public class ApDTO {

    private String employeeCode;
    private String documentName;
    private String content;
    private String status;
    private String createdAt;
}
