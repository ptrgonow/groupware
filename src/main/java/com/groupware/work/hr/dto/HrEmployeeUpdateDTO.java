package com.groupware.work.hr.dto;

import lombok.Data;

@Data
public class HrEmployeeUpdateDTO {

    private String employeeCode;
    private String newEmployeeCode;  // 새로 입력한 사원코드
    private String departmentName;
    private String psNm;
}
