package com.groupware.mypage.dto;

import lombok.Data;

@Data
public class TodoDTO {

    private int todoId;
    private String content;
    private String employeeCode;
    private String status;
    private String createdAt;
    private boolean completed;

}
