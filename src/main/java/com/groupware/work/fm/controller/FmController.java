package com.groupware.work.fm.controller;

import com.groupware.work.fm.dto.FmDTO;
import com.groupware.work.fm.service.FmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fm")
public class FmController {

    private final FmService fmService;

    @Autowired
    public FmController(FmService fmService) {
        this.fmService = fmService;
    }

    @GetMapping("/expenses")
    public ResponseEntity<List<FmDTO>> getApprovedExpenses() {
        List<FmDTO> approvedExpenses = fmService.getApprovedFixedExpenses();
        return ResponseEntity.ok(approvedExpenses);
    }

    @PostMapping("/expenses")
    public ResponseEntity<Void> logFixedExpense(@RequestBody FmDTO fixedExpenseDTO) {
        fmService.logFixedExpense(fixedExpenseDTO);
        return ResponseEntity.ok().build();
    }
}
