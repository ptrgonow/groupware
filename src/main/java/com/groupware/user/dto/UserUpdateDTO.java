package com.groupware.user.dto;

import lombok.Data;

@Data
public class UserUpdateDTO {

    private String employeeCode;
    private String birthDate;
    private String address;
    private String detailAddress;
    private String extraAddress;
    private String username;
    private String password;
}
