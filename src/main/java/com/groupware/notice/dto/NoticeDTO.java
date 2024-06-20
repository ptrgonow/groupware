package com.groupware.notice.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

// NoticeDTO.java

@Data
public class NoticeDTO {
    private int noticeId;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private String employeeCode;
    private int departmentId;
    private String departmentName;
}
