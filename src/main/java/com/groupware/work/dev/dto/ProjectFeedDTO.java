package com.groupware.work.dev.dto;

import lombok.Data;

@Data
public class ProjectFeedDTO {

    private int feed_id;
    private String project_id;
    private String employee_code;
    private String content;
    private String name;
    private String created_at;
}
