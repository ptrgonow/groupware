package com.groupware.work.dev.dto;

import lombok.Data;

@Data
public class ProjectMemberDTO {

    private int project_member_id;
    private int project_id;
    private String employee_code;
    private String name;
}
