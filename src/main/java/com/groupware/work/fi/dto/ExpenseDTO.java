package com.groupware.work.fi.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ExpenseDTO {

    private String accountType;
    private String expenseType;
    private Date issueDate;
    private String refNumber;
    private String recipient;
    private int totalCharge;
    private String memo;

}
