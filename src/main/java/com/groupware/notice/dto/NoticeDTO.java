package com.groupware.notice.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class NoticeDTO {

    private int notice_id;
    private String title;
    private String name;
    private String content;
    private LocalDateTime created_at;
    private String employee_code;
    private int department_id;
}
