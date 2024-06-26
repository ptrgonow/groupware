package com.groupware.work.dev.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProjectUpdateRequestDTO {

    private ProjectDTO projectDTO;
    private List<ProjectMemberDTO> members;
    private List<ProjectTaskDTO> tasks;
    private List<Long> deletedMembers;

}
