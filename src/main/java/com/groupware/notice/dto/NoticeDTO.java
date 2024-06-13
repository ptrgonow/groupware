package com.groupware.notice.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NoticeDTO {

    private int notice_id;
    private String title;
    private String content;
    private LocalDateTime created_at; // LocalDateTime을 사용하여 자동으로 생성되도록 변경
    private String employee_code;

    // content 필드의 null 여부 확인 및 설정
    public void setContent(String content) {
        if (content != null && !content.isEmpty()) {
            this.content = content;
        } else {
            this.content = ""; // 빈 문자열로 설정
        }
    }

    // 생성일 자동 설정
    public NoticeDTO() {
        this.created_at = LocalDateTime.now();
    }

    // content 필드의 null 여부 확인 및 반환
    public String getContent() {
        if (content != null && !content.isEmpty()) {
            return content;
        } else {
            return ""; // 빈 문자열 반환하거나, 필요에 따라 다른 값을 반환하세요.
        }
    }
}
