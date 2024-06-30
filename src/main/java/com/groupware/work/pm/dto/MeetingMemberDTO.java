package com.groupware.work.pm.dto;

import lombok.Data;

@Data
public class MeetingMemberDTO {

    private int memberId;
    private String employeeCode;
    private String name; // 멤버 이름
    private String departmentName;
    private String positionName;

}
