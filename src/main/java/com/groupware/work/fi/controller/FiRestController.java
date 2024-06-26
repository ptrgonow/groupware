package com.groupware.work.fi.controller;

import com.groupware.work.fi.dto.ChartDTO;
import com.groupware.work.fi.dto.ExpenseDTO;
import com.groupware.work.fi.service.FiService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/finance")
@AllArgsConstructor
public class FiRestController {

    private final FiService fiService;

    @PostMapping("/save")
    public ResponseEntity<String> saveExpense(@RequestBody ExpenseDTO expenseDTO) {
        try {
            ExpenseDTO expense = new ExpenseDTO();
            expense.setAccountType(expenseDTO.getAccountType());
            expense.setExpenseType(expenseDTO.getExpenseType());
            expense.setIssueDate(expenseDTO.getIssueDate());
            expense.setRefNumber(expenseDTO.getRefNumber());
            expense.setRecipient(expenseDTO.getRecipient());
            expense.setTotalCharge(expenseDTO.getTotalCharge());
            expense.setMemo(expenseDTO.getMemo());

            boolean res = fiService.saveExpense(expense);
            if (res) {
                return ResponseEntity.ok("Success");
            } else {
                return ResponseEntity.badRequest().body("Failed");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed");
        }
    }

    @GetMapping("/chart")
    public ResponseEntity<List<ChartDTO>> getChart() {

        List<ChartDTO> chart = fiService.getChart();

        if (chart != null) {
            Map<String, List<ChartDTO>> res = new HashMap<>();
            res.put("chartData", chart);
            return ResponseEntity.ok(chart);
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
