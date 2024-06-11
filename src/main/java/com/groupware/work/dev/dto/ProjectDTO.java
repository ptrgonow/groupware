package com.groupware.work.dev.dto;

import lombok.Data;

@Data
public class ProjectDTO {

    private int project_id;
    private String project_name;
    private String start_date;
    private String end_date;
    private String status;
    private int department_id;
    private String description;
    private String create_at;

}
