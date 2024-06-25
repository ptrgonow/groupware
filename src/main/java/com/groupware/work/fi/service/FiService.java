package com.groupware.work.fi.service;


import com.groupware.approval.dto.ApprovalDTO;
import com.groupware.work.fi.dto.ExpenseDTO;
import com.groupware.work.fi.dto.SalDTO;
import com.groupware.work.fi.mapper.FiMapper;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class FiService {

    private final FiMapper fiMapper;

    public List<SalDTO> getAllMemberSalary() {
        return fiMapper.getAllMemberSalary();
    }


    public List<ApprovalDTO> getFinanceApprovalList( ) {
            return fiMapper.getFinanceApprovalList();
    }

    public boolean saveExpense(ExpenseDTO expense) {
       return fiMapper.saveExpense(expense);
    }
}

