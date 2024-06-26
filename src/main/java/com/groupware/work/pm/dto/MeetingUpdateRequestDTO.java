package com.groupware.work.pm.dto;

import lombok.Data;

import java.util.List;

@Data
public class MeetingUpdateRequestDTO {

    private PmDTO pmDTO;
    private List<MeetingMemberDTO> meetingMembers;
    private List<String> deletedMembers;

}
