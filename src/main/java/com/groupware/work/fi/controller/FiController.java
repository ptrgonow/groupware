package com.groupware.work.fi.controller;

import com.groupware.work.fi.dto.SalDTO;
import com.groupware.work.fi.service.FiService;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/fi")
@AllArgsConstructor
public class FiController {

    private final FiService fiService;

    @GetMapping("/sal/list")
    public ResponseEntity<Map<String, Object>> getAllMemberSalary() {

        List<SalDTO> allMemberSalary = fiService.getAllMemberSalary();
        Map<String, Object> sList = new HashMap<>();
        int totalItem = allMemberSalary.size();
        sList.put("totalItem", totalItem);
        sList.put("salList", allMemberSalary);
        return ResponseEntity.ok(sList);
    }

}
