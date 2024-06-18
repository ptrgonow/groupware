package com.groupware.work.dev.dto;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class ProjectDetailsDTO {

    private int projectId;
    private String projectName;
    private String startDate;
    private String endDate;
    private String status;
    private int departmentId;
    private String description;
    private Date createAt;
    private String employeeCode;
    private List<ProjectMemberDTO> members;
    private List<ProjectTaskDTO> tasks;
    private List<ProjectFeedDTO> feeds;
}
