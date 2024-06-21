package com.groupware.work.pm.service;

import com.groupware.user.dto.PrMemDTO;
import com.groupware.user.service.UserService;
import com.groupware.work.dev.dto.ProjectDTO;
import com.groupware.work.pm.dto.MeetingMemberDTO;
import com.groupware.work.pm.dto.PmDTO;
import com.groupware.work.pm.mapper.PmMapper;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.annotations.Param;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor // Lombok을 사용하여 생성자 주입
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
    public void updateMeeting(PmDTO pmDTO, int meetingId, List<MeetingMemberDTO> meetingMembers) {
        pmMapper.updateMeeting(pmDTO);
        // 새로운 멤버 추가
        for (MeetingMemberDTO newMember : meetingMembers) {
            pmMapper.insertMeetingMember(meetingId, newMember.getEmployeeCode());
        }
        for (MeetingMemberDTO removedMembers : meetingMembers) {
            pmMapper.deleteMeetingMember(meetingId, removedMembers.getEmployeeCode());
        }
    }



    public PmDTO getMeetingById(int meetingId) {
        PmDTO pmDTO = pmMapper.getMeetingById(meetingId);
        if (pmDTO != null) {
            List<MeetingMemberDTO> meetingMembers = pmMapper.getMeetingMembersByMeetingId(meetingId);
            pmDTO.setMeetingMembers(meetingMembers);
        }
        return pmDTO;
    }

    @Transactional
    public void deleteMeeting(int meetingId) {
        pmMapper.deleteMeeting(meetingId);
    }

    public List<MeetingMemberDTO> getMeetingMembers(@Param("meetingId") int meetingId){

        return pmMapper.getMeetingMembersByMeetingId(meetingId);

    }
    public List<PrMemDTO> getAllEmployees() {
        List<PrMemDTO> employees = pmMapper.getAllEmployees();
        logger.info("Fetched all employees: {}", employees);
        return employees;
    }


}
