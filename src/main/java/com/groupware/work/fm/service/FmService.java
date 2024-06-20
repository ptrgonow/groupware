package com.groupware.work.fm.service;

import com.groupware.approval.dto.ApprovalDTO;
import com.groupware.work.fm.dto.ExpenseDTO;
import com.groupware.work.fm.dto.SalaryDTO;
import com.groupware.approval.dto.DeptTreeDTO;
import com.groupware.work.fm.dto.FixedExpensesDTO;
import com.groupware.work.fm.mapper.FmMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FmService {

    private final FmMapper fmMapper;

    @Autowired
    public FmService(FmMapper fmMapper) {
        this.fmMapper = fmMapper;
    }

    /* SALARY BY DEPARTMENT - 끝*/
    public List<DeptTreeDTO> getAllDepartments() {
        return fmMapper.getDepartments();
    }
    public List<SalaryDTO> getSalariesByDepartment(int departmentId) {
        return fmMapper.getSalariesByDepartment(departmentId);
    }

    /* FIXED EXPENSES - 결재 완료 상태인 폼 처리 후 차트에 자동 반영하기 위해 만들어짐 - 미구현*/
    public List<FixedExpensesDTO> getFixedExpenses() {
        return fmMapper.getFixedExpensesWithCategory();
    }
    public List<FixedExpensesDTO> getCompletedFixedExpenses(String fileCd) {
        return fmMapper.getCompletedFixedExpenses(fileCd);
    }

    /* DATA ENTRY - 뷰 페이지 테이터 입력 - 구현중..*/
    public void saveExpense(ExpenseDTO expenseDTO){
        fmMapper.insertExpense(expenseDTO);
    }


}