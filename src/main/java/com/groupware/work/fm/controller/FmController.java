package com.groupware.work.fm.controller;

import com.groupware.work.fm.dto.FmApprovedDTO;
import com.groupware.work.fm.dto.ExpenseDTO;
import com.groupware.work.fm.dto.SalaryDTO;
import com.groupware.approval.dto.DeptTreeDTO;
import com.groupware.work.fm.dto.FixedExpensesDTO;
import com.groupware.work.fm.service.FmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/fm")
public class FmController {

    private final FmService fmService;

    @Autowired
    public FmController(FmService fmService) {
        this.fmService = fmService;
    }

    /* SALARY BY DEPARTMENT - 끝*/
    @GetMapping("/departments")
    public List<DeptTreeDTO> getDepartments() {
        return fmService.getAllDepartments();
    }
    @GetMapping("/salariesByDepartment")
    public List<SalaryDTO> getSalariesByDepartment(@RequestParam("departmentId") int departmentId) {
        return fmService.getSalariesByDepartment(departmentId);
    }

    /* FIXED EXPENSE - 결재 완료 상태인 폼 처리 후 차트에 자동 반영하기 위해 만들어짐 - 미구현*/
    @GetMapping("/fixedExpenses")
    public List<FixedExpensesDTO> getFixedExpenses() {
        return fmService.getFixedExpenses();
    }
    @GetMapping("/completedFixedExpenses")
    public List<FixedExpensesDTO> getCompletedFixedExpenses(@RequestParam String fileCd) {
        return fmService.getCompletedFixedExpenses(fileCd);
    }

    /* DATA ENTRY - 뷰 페이지 테이터 입력 */
    @PostMapping("/saveExpense")
    public ResponseEntity<Map<String, String>> saveExpense(@RequestBody ExpenseDTO expenseDTO){
        fmService.saveExpense(expenseDTO);
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }

    /* APPROVED VIEW PAGE BOARD */
    @GetMapping("/approved-list")
    public String getApprovedList(Model model) {
        List<FmApprovedDTO> approvedList = fmService.getApprovedApprovals();
        model.addAttribute("approvedList", approvedList);
        return "main-finance";
    }

}
