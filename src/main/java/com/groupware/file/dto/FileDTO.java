package com.groupware.file.dto;

import lombok.Data;

@Data
public class FileDTO {

    private int id;
    private String title;
    private String fileUrl;
    private String createdBy;
    private String departmentName;
    private String createdAt;
    private String updatedAt;
    private String fileCd;
}
