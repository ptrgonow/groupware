package com.groupware.work.fm.service;

import com.groupware.work.fm.dto.ExpenseDTO;
import com.groupware.work.fm.dto.FmApprovedDTO;
import com.groupware.work.fm.dto.SalaryDTO;
import com.groupware.approval.dto.DeptTreeDTO;
import com.groupware.work.fm.mapper.FmMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
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

    /* FIXED EXPENSES - 결재 완료 상태인 서류를 관리자가 수동으로 처리 후 차트에 반영하기.. */
    public ArrayList<HashMap<String, Double>> getExpensesListMap() {
        int[] mArr = {1, 3, 6, 12};
        var expenseTypeMapList = new ArrayList<HashMap<String,Double>>();
        for(int months : mArr){
            List<ExpenseDTO> expenseDTOList1 = fmMapper.getExpensesList(months);
            System.out.println("=======" + expenseDTOList1.size());
            var expenseTypeMap = new HashMap<String, Double>();
            for(ExpenseDTO expenseDTO : expenseDTOList1) {
                String type = expenseDTO.getExpenseType();
                Double paymentAmount = expenseDTO.getPaymentAmount();
                System.out.println(type);
                System.out.println(paymentAmount);
                if(expenseTypeMap.containsKey(type)) {
                    expenseTypeMap.put(type, expenseTypeMap.get(type) + paymentAmount);
                }else{
                    expenseTypeMap.put(type, paymentAmount);
                }
            }
            expenseTypeMapList.add(expenseTypeMap);
        }
        return expenseTypeMapList;
    }

    /* DATA ENTRY - 뷰 페이지 테이터 입력 */
    public void saveExpense(ExpenseDTO expenseDTO){
        fmMapper.insertExpense(expenseDTO);
    }

    /* APPROVED VIEW PAGE BOARD */
    public List<FmApprovedDTO> getApprovedList() {
        return fmMapper.getApprovedList();
    }

}
