package com.groupware.work.fm.dto;

import lombok.Data;

import java.util.Date;

@Data
public class FmDTO {

    public static class Department{
        private int departmentId;
        private String departmentName;
        private Integer parentDepartmentId;
        private String managerEmpCode;
    }
    public static class Employee{
        private String exployeeCode;
        private String name;
        private Date birthDate;
        private String address;
        private String departmentId;
        private String psCd;
        private String status;
        private Date createdAt;
        private String username;
        private String password;
    }
    public static class Approval{
        private int approvalId;
        private String employeeCode;
        private String documentName;
        private String content;
        private String status;
        private Date createdAt;
    }
    public static class ApprovalPath{
        private int pathId;
        private int approvalId;
        private String employeeCode;
        private int sequence;
        private String status;
    }
    public static class Salary{
        private int salaryId;
        private String employeeCode;
        private String decription;
        private double amount;
        private Date date;
    }

}
