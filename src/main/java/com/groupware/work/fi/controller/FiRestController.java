package com.groupware.work.fi.controller;

import com.groupware.work.fi.dto.ExpenseDTO;
import com.groupware.work.fi.service.FiService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
