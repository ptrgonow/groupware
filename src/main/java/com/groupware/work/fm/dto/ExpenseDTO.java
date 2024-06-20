package com.groupware.work.fm.dto;

import lombok.Data;

@Data
public class ExpenseDTO {
    private int expenseId;
    private String accountType;
    private String expenseType;
    private String issueDate;
    private String refNumber;
    private String recipient;
    private double totalCharge;
    private double paymentAmount;
    private double balance;
    private String memo;
}
