package com.groupware.mypage.dto;

import lombok.Data;

@Data
public class TodoDTO {

    private String content;
    private String employeeCode;
    private String status;
    private String createdAt;

}
