package com.groupware.work.hr.dto;

import lombok.Data;

import java.util.Date;

@Data
public class HrApprovalDTO {

    private String title;
    private String name;
    private String departmentName;
    private Date createdAt;
    private String status;
}
