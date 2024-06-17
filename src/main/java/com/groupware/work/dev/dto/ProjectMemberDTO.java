package com.groupware.work.dev.dto;

import lombok.Data;

@Data
public class ProjectMemberDTO {
    private int memberId;
    private String memberEmployeeCode;
    private String memberName;
    private String memberDepartmentName;
    private String memberPosition;
}
