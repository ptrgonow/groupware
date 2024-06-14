package com.groupware.notice.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NoticeDTO {

    private int notice_id;
    private String title;
    private String content;
    private String  created_at;
    private String employee_code;
    private int department_id;
}
