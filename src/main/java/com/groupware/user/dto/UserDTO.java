package com.groupware.user.dto;

import lombok.Data;

@Data
public class UserDTO {

    private String employeeCode;
    private String name;
    private String birthDate;
    private String address;
    private int departmentId;
    private String position;
    private String status;
    private String createdAt;
    private String username;
    private String password;

}
