package com.groupware.work.pm.controller;

import com.groupware.user.dto.PrMemDTO;
import com.groupware.user.dto.UserDTO;
import com.groupware.work.pm.dto.MeetingMemberDTO;
import com.groupware.work.pm.dto.PmDTO;
import com.groupware.work.pm.service.PmService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/pm") // API 요청 경로 추가
public class PmController {

    private final PmService pmService;

    @PostMapping("/meetings")
    public ResponseEntity<String> createMeeting(@RequestBody PmDTO pmDTO, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");
        pmDTO.setEmployeeCode(user.getEmployeeCode());

        try {
            pmService.insertMeeting(pmDTO);
            return ResponseEntity.ok("회의 일정이 성공적으로 추가되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("미팅 일정 추가 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/meetings/{meetingId}")
    public ResponseEntity<PmDTO> getMeetingDetail(@PathVariable int meetingId){
        PmDTO meeting = pmService.getMeetingById(meetingId);
        System.out.println(meeting);
        return ResponseEntity.ok(meeting);
    }
    @PutMapping("/editMeetings/{meetingId}")
    public ResponseEntity<String> updateMeeting(@PathVariable int meetingId, @RequestBody PmDTO pmDTO, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        pmDTO.setMeetingId(meetingId);
        pmDTO.setEmployeeCode(user.getEmployeeCode());

        try {
            List<MeetingMemberDTO> meetingMembers = pmDTO.getMeetingMembers(); // PmDTO에서 meetingMembers 가져오기
            pmService.updateMeeting(pmDTO, meetingId, meetingMembers); // meetingMembers 전달
            return ResponseEntity.ok("회의 일정이 성공적으로 수정되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("미팅 일정 수정 중 오류가 발생했습니다.");
        }
    }

    @DeleteMapping("/deleteMeetings/{meetingId}")
    public ResponseEntity<String> deleteMeeting(@PathVariable int meetingId, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        try {
            pmService.deleteMeeting(meetingId);
            return ResponseEntity.ok("회의 일정이 성공적으로 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("미팅 일정 삭제 중 오류가 발생했습니다.");
        }
    }
    @GetMapping("/meet/list")
    public ResponseEntity<Map<String, Object>> getMembers() {
        List<PrMemDTO> user = pmService.getAllEmployees();
        Map<String, Object> response = new HashMap<>();
        response.put("members", user);
        return ResponseEntity.ok(response);
    }
}
