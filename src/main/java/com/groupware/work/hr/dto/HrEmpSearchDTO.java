package com.groupware.work.hr.dto;

import lombok.Data;

import java.util.List;

@Data
public class HrEmpSearchDTO {

    private List<HrEmplMagDTO> users;
    private List<String> status;

    // 생성자
    public HrEmpSearchDTO(List<HrEmplMagDTO> users, List<String> status) {
        this.users = users;
        this.status = status;
    }

}

