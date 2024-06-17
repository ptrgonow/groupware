package com.groupware.work.dev.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProjectUpdateRequestDTO {

    private ProjectDTO project;
    private List<ProjectMemberDTO> members;
    private List<ProjectTaskDTO> tasks;

}
