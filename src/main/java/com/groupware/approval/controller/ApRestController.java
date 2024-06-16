package com.groupware.approval.controller;

import com.groupware.approval.dto.*;
import com.groupware.approval.service.ApService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/approval")
@RequiredArgsConstructor
public class ApRestController {

    private final ApService apService;


    @GetMapping("/tree")
    public ResponseEntity<Map<String, Object>> getTreeItems() {
        try {
            List<EmployeeDTO> emp = apService.getEmployeeList();
            List<DeptTreeDTO> dept = apService.getDeptList();
            List<PositionsDTO> pos = apService.getPositionList();

            Map<String, Object> tree = new HashMap<>();

            tree.put("emp", emp);
            tree.put("dept", dept);
            tree.put("pos", pos);
            return ResponseEntity.ok(tree);
        } catch (Exception e) {
            // 에러 로깅 및 처리
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "데이터를 가져오는 중 오류가 발생했습니다."));
        }
    }

    @GetMapping("/docno")
    public ResponseEntity<Map<String, Object>> getDocNo() {
        try {
            List<DocNoDTO> docNoList = apService.getDocNo();

            Map<String, Object> doc = new HashMap<>();
            doc.put("docNos", docNoList);
            return ResponseEntity.ok(doc);
        } catch (Exception e) {
            // Error logging and handling
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "데이터를 가져오는 중 오류가 발생했습니다."));
        }
    }

    @PostMapping("/send")
    public ResponseEntity<String> handleApproval(@RequestBody ApprovalRequest approvalRequest) {
        try {
            apService.createApproval(
                    approvalRequest.getApprovalDTO(),
                    approvalRequest.getApprovalPath(),
                    approvalRequest.getApprovalReferences(),
                    approvalRequest.getApprovalConsensus()
            );
            return ResponseEntity.ok("Approval processed");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("데이터를 처리하는 중 오류가 발생했습니다.");
        }
    }


    @PostMapping("/updateStatus")
    public ResponseEntity<String> updateApprovalStatus(
            @RequestParam int approvalId,
            @RequestParam String employeeCode,
            @RequestParam String newStatus) {
        try {
            apService.updateApprovalStatus(approvalId, employeeCode, newStatus);
            return ResponseEntity.ok("Approval status updated");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("상태 업데이트 중 오류가 발생했습니다.");
        }
    }

    @PostMapping("/updateConsensusStatus")
    public ResponseEntity<String> updateConsensusStatus(
            @RequestParam int approvalId,
            @RequestParam String employeeCode,
            @RequestParam String newStatus) {
        try {
            apService.updateConsensusStatus(approvalId, employeeCode, newStatus);
            return ResponseEntity.ok("Consensus status updated");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("상태 업데이트 중 오류가 발생했습니다.");
        }
    }



}
