package com.groupware.work.fm.service;

import com.groupware.work.fm.dto.FmDTO;
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

    public List<FmDTO> getApprovedFixedExpenses() {
        String approverCode = fmMapper.getManagerEmployeeCode();
        return fmMapper.getApprovedFixedExpenses(approverCode);
    }

    public void logFixedExpense(FmDTO fixedExpenseDTO) {
        fmMapper.logFixedExpense(fixedExpenseDTO);
    }
}
