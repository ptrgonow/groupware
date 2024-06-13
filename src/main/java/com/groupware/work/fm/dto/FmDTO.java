package com.groupware.work.fm.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class FmDTO{
    private int expenseId;
    private String itemName;
    private BigDecimal amount;
    private Date date;
    private String employeeCode;
}
