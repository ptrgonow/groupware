package com.groupware.work.dev.dto;

import lombok.Data;

import java.util.Date;

@Data
public class GitHookDTO {

    private String payload;
    private Date createdAt;

}
