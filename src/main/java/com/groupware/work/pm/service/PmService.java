package com.groupware.work.pm.service;

import com.groupware.user.dto.PrMemDTO;
import com.groupware.user.service.UserService;
import com.groupware.work.dev.dto.ProjectDTO;
import com.groupware.work.pm.dto.MeetingDetailsDTO;
import com.groupware.work.pm.dto.MeetingMemberDTO;
import com.groupware.work.pm.dto.PmDTO;
import com.groupware.work.pm.mapper.PmMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PmService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final PmMapper pmMapper;

    public List<ProjectDTO> getProjects(){
        return pmMapper.getProjects();
    }

    public List<PmDTO> getMeetings() {
        List<PmDTO> meetings = pmMapper.getMeetings();

        for (PmDTO meeting : meetings) {
            String formattedSchedule = formatSchedule(meeting.getMeetingStartTime(), meeting.getMeetingEndTime());
            meeting.setFormattedSchedule(formattedSchedule); // @Data 어노테이션으로 생성된 setter 사용
        }

        return meetings;
    }

    private String formatSchedule(LocalDateTime startTime, LocalDateTime endTime) {
        LocalDate today = LocalDate.now(); // 오늘 날짜
        LocalDate meetingDate = startTime.toLocalDate(); // 회의 날짜

        if (meetingDate.isEqual(today)) { // 오늘이면 시간만 표시
            return startTime.format(DateTimeFormatter.ofPattern("HH:mm")) + " ~ " + endTime.format(DateTimeFormatter.ofPattern("HH:mm"));
        } else { // 오늘이 아니면 날짜와 시간 표시
            return startTime.format(DateTimeFormatter.ofPattern("MM/dd"));
        }
    }
    @Transactional
    public void insertMeeting(PmDTO pmDTO) {
        pmMapper.insertMeeting(pmDTO);
    }

    @Transactional
    public void updateMeeting(PmDTO pmDTO, List<MeetingMemberDTO> members, List<Long> deletedMembers) {
        pmMapper.updateMeeting(pmDTO); // 회의 정보 업데이트

        for (MeetingMemberDTO member : members) {
            if (member.getMemberId() == 0) {
                pmMapper.insertMeetingMember(pmDTO.getMeetingId(), member.getEmployeeCode());
            } else {
                pmMapper.updateMeetingMember(pmDTO.getMeetingId(), member);
            }
        }

        for (Long memberId : deletedMembers){
            pmMapper.deleteMeetingMember(memberId, pmDTO.getMeetingId());
        }
    }

    @Transactional
    public MeetingDetailsDTO getMeetingById(int meetingId) {
      List<MeetingDetailsDTO> meetingDetailsList = pmMapper.getMeetingById(meetingId);
      List<MeetingMemberDTO> members = pmMapper.getMeetingMembersByMeetingId(meetingId);

      MeetingDetailsDTO meetingDetails = meetingDetailsList.get(0);
      meetingDetails.setMeetingMembers(members);

      return meetingDetails;
    }

    @Transactional
    public void deleteMeeting(int meetingId) {
        pmMapper.deleteMeeting(meetingId);
    }

    public List<PrMemDTO> getAllEmployees() {
        List<PrMemDTO> employees = pmMapper.getAllEmployees();
        logger.info("Fetched all employees: {}", employees);
        return employees;
    }


}
