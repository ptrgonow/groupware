package com.groupware.work.fm.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ExpenseDTO {
    private int expenseId;
    private String accountType;
    private String expenseType;
    private Date issueDate;
    private String refNumber;
    private String recipient;
    private Double totalCharge;
    private Double paymentAmount;
    private Double balance;
    private String memo;
}
