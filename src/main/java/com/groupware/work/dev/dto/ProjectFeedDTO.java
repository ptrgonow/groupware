package com.groupware.work.dev.dto;

import lombok.Data;

@Data
public class ProjectFeedDTO {
    private int feedId;
    private String projectId;
    private String employeeCode;
    private String content;
    private String name;
    private String createdAt;
}
