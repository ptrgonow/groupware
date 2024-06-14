package com.groupware.attendance.controller;

import com.groupware.attendance.dto.AttDTO;
import com.groupware.attendance.service.AttService;
import com.groupware.user.dto.UserDTO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/att")
public class AttController {

    private final AttService attService;

    @Autowired
    public AttController(AttService attService) {
        this.attService = attService;
    }

    @PostMapping("/insert")
    public ResponseEntity<String> insertAttendance(@RequestParam String employee_code, @RequestParam String action) {
        LocalDateTime dateTime = LocalDateTime.now();

        AttDTO attDTO = new AttDTO();
        attDTO.setEmployeeCode(employee_code);
        if ("start".equals(action)) {
            attDTO.setCheckIn(dateTime);
            attDTO.setStatus("근무중");
            attService.startAttendance(attDTO);
        } else if ("end".equals(action)) {
            attDTO.setCheckOut(dateTime);
            attDTO.setStatus("퇴근");
            attService.endAttendance(attDTO);
        }
        return ResponseEntity.ok("근태 기록이 성공적으로 저장되었습니다.");
    }

    @GetMapping("/status")
    public ResponseEntity<AttDTO> getStatus(@RequestParam String employee_code) {
        Optional<AttDTO> attDTO = attService.getAttendanceStatus(employee_code);
        return attDTO.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @GetMapping("/records")
    public ResponseEntity<List<AttDTO>> getAttendanceRecords(@RequestParam String employee_code) {
        List<AttDTO> records = attService.getAttendanceRecords(employee_code);
        return ResponseEntity.ok(records);
    }

}
