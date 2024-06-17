package com.groupware.work.dev.dto;

import lombok.Data;

@Data
public class ProjectTaskDTO {

    private int project_task_id;
    private int project_id;
    private String created_at;
    private String employee_code;
    private int progress;
    private String task_content;
    private String name;


}
