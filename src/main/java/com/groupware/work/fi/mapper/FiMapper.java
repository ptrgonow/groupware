package com.groupware.work.fi.mapper;

import com.groupware.approval.dto.ApprovalDTO;
import com.groupware.work.fi.dto.ExpenseDTO;
import com.groupware.work.fi.dto.SalDTO;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface FiMapper {

    @Select("SELECT e.employee_code AS employeeCode, e.name AS employeeName," +
            "e.department_id AS departmentId, d.department_name AS departmentName," +
            "p.ps_nm AS positionName, s.amount AS salary, e.hiredate " +
            "FROM employee e " +
            "JOIN salary s ON e.employee_code = s.employee_code " +
            "JOIN department d ON e.department_id = d.department_id " +
            "JOIN positions p ON e.ps_cd = p.ps_cd " +
            "WHERE NOT d.department_id = 1 " +
            "ORDER BY p.ps_cd, d.department_id ")
    List<SalDTO> getAllMemberSalary();

    @Select("SELECT DISTINCT " +
            "a.approval_id AS approvalId, " +
            "a.employee_code AS employeeCode, " +
            "e.name AS employeeName, " +
            "t.title AS fileName, " +
            "a.created_at AS createdAt " +
            "FROM approval a " +
            "JOIN employee e ON a.employee_code = e.employee_code " +
            "JOIN department d ON e.department_id = d.department_id " +
            "JOIN templates t ON a.file_cd = t.file_cd " +
            "LEFT JOIN approval_path p ON a.approval_id = p.approval_id " +
            "LEFT JOIN employee ep ON p.employee_code = ep.employee_code " +
            "LEFT JOIN approval_consensus c ON a.approval_id = c.approval_id " +
            "LEFT JOIN employee ec ON c.employee_code = ec.employee_code " +
            "WHERE d.department_id = 10 " +
            "   OR ep.department_id = 10 " +
            "   OR ec.department_id = 10 " +
            "ORDER BY a.approval_id DESC")
    List<ApprovalDTO> getFinanceApprovalList();


    @Insert("INSERT INTO expense (account_type, expense_type, issue_date, ref_number, recipient, total_charge, payment_amount, balance, memo) " +
            "VALUES (#{accountType}, #{expenseType}, #{issueDate}, #{refNumber}, #{recipient}, #{totalCharge}, #{paymentAmount}, #{balance}, #{memo})")
    boolean saveExpense(ExpenseDTO expense);
}
