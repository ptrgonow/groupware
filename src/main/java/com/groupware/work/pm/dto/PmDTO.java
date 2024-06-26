package com.groupware.work.pm.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PmDTO {

    private int meetingId;
    private String meetingTitle;
    private String meetingContent;
    private LocalDateTime createdAt;
    private String employeeCode;
    private LocalDateTime meetingStartTime;
    private LocalDateTime meetingEndTime;
    private String name;
    private String formattedSchedule;

}
