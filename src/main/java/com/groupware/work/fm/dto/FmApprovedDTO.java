package com.groupware.work.fm.dto;

import lombok.Data;

import java.util.Date;

@Data
public class FmApprovedDTO {

    private int approvalId;
    private String employeeCode;
    private String employeeName; // 추가: employeeName
    private String departmentCode;
    private String departmentName;
    private String fileCd;
    private String content;
    private String status;
    private Date createdAt;
    private Date duedateAt;
    private String fileName;
    private String title; // templates 테이블의 title 컬럼과 매핑
}