package com.groupware.work.dev.dto;

import lombok.Data;

@Data
public class ProjectDTO {

    private int projectId;
    private String projectName;
    private String startDate;
    private String endDate;
    private String status;
    private int departmentId;
    private String description;
    private String createAt;
    private String employeeCode;

}
