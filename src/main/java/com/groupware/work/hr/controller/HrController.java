package com.groupware.work.hr.controller;

import com.groupware.work.hr.dto.TodayWorkerDTO;
import com.groupware.work.hr.service.HrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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

}
