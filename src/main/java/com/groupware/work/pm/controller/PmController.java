package com.groupware.work.pm.controller;

import com.groupware.user.dto.PrMemDTO;
import com.groupware.user.dto.UserDTO;
import com.groupware.work.pm.dto.MeetingDetailsDTO;
import com.groupware.work.pm.dto.MeetingMemberDTO;
import com.groupware.work.pm.dto.MeetingUpdateRequestDTO;
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

    @GetMapping("/mem/list")
    public ResponseEntity<Map<String, Object>> getMember(){
        List<PrMemDTO> user = pmService.getAllEmployees();
        Map<String, Object> response = new HashMap<>();
        response.put("members", user);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/meetings/detail")
    public ResponseEntity<Map<String, Object>> getMeetingDetail(@RequestParam int meetingId){
        MeetingDetailsDTO meetingDetails = pmService.getMeetingById(meetingId);

        Map<String, Object> response = new HashMap<>();
        response.put("meeting", meetingDetails);
        response.put("members", meetingDetails.getMeetingMembers());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/edit")
    public ResponseEntity<String> updateMeeting(@RequestBody MeetingUpdateRequestDTO meetingUpdateRequest) {
        try {
            pmService.updateMeeting(
                    meetingUpdateRequest.getPmDTO(),
                    meetingUpdateRequest.getMeetingMembers(),
                    meetingUpdateRequest.getDeletedMembers()
            );
            return ResponseEntity.ok("회의 일정이 성공적으로 수정되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("미팅 일정 수정 중 오류가 발생했습니다.");
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
