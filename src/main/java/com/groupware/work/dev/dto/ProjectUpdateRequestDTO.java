package com.groupware.work.dev.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProjectUpdateRequestDTO {

    private ProjectDTO project;     // 수정된 프로젝트 정보
    private List<ProjectMemberDTO> members;
    private List<ProjectTaskDTO> tasks; // 수정된 작업 목록

}
