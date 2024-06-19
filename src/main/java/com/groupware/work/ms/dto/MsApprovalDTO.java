package com.groupware.work.ms.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MsApprovalDTO {

    private String title;
    private String name;
    private LocalDateTime createdAt;
    private String status;

}
