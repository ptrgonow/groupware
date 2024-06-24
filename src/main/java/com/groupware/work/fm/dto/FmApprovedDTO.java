package com.groupware.work.fm.dto;

import lombok.Data;

import java.util.Date;

@Data
public class FmApprovedDTO {

    private int approvalId; // from approval 테이블
    private String employeeCode; // from approval 테이블
    private String employeeName; // 추가: employeeName from employee 테이블
    private Date createdAt; // from approval 테이블
    private String title; // templates 테이블의 title 컬럼과 매핑
}