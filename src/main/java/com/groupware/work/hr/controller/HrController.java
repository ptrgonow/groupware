package com.groupware.work.hr.controller;

import com.groupware.work.hr.dto.HrEmplMagDTO;
import com.groupware.work.hr.dto.HrEmployeeUpdateDTO;
import com.groupware.work.hr.dto.TodayWorkerDTO;
import com.groupware.work.hr.service.HrService;
import org.apache.ibatis.annotations.Delete;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/hr")
public class HrController {

    private final HrService hrService;

    @Autowired
    public HrController(HrService hrService) {
        this.hrService = hrService;
    }

    @GetMapping("/workers")
    public ResponseEntity<List<TodayWorkerDTO>> getWorkers(){
        List<TodayWorkerDTO> workers = hrService.getAllTodayWorkers();
        return ResponseEntity.ok(workers);
    }

    @GetMapping("/empdetail")
    public ResponseEntity<HrEmplMagDTO> getEmpInfo(@RequestParam String employeeCode){
        HrEmplMagDTO empinfo = hrService.getEmplInfo(employeeCode);
        return ResponseEntity.ok(empinfo);
    }

    @GetMapping("/empmodi")
    public ResponseEntity<Map<String, List<String>>> getModiList() {
        Map<String, List<String>> modi = new HashMap<>();
        modi.put("departments", hrService.getDepartments());
        modi.put("positions", hrService.getPositions());
        return ResponseEntity.ok(modi);
    }

    @PostMapping("/empdelete")
    public ResponseEntity<Map<String, Object>> deleteEmployee(@RequestParam String employeeCode) {
        hrService.deleteEmployeeByCode(employeeCode);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "사원 정보가 삭제되었습니다.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/empupdate")
    public ResponseEntity<Map<String, Object>> updateEmployeeDetails(@RequestBody HrEmployeeUpdateDTO employeeUpdateDTO) {
        Map<String, Object> response = new HashMap<>();
        try {
            hrService.updateEmployeeDetails(employeeUpdateDTO);
            response.put("success", true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();  // 예외 로그 출력
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
