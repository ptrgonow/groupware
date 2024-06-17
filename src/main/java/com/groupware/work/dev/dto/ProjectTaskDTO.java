package com.groupware.work.dev.dto;

import lombok.Data;

@Data
public class ProjectTaskDTO {
    private int taskId;
    private String taskContent;
    private String taskEmployeeCode;
    private int taskProgress;
    private String taskEmployeeName;
}
