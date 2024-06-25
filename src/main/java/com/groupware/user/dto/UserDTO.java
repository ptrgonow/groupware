package com.groupware.user.dto;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class UserDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String employeeCode;
    private String name;
    private String birthDate;
    private String address;
    private String detailAddress;
    private String extraAddress;
    private int departmentId;
    private String departmentName;
    private String ps_cd;
    private String status;
    private String hiredate;
    private String username;
    private String password;
    private String dayoff;
    private String vacation;

}
