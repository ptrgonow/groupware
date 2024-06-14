package com.groupware.work.dev.dto;

import lombok.Data;

@Data
public class ProjectEditDTO {

    private int project_id;
    private String project_name;
    private String start_date;
    private String end_date;
    private String description;
    private String created_at;
    private String employee_code;
    private String name;
    private int project_task_id;
    private String progress;
    private String task_content;


}
