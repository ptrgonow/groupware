package com.groupware.work.fm.mapper;

import com.groupware.work.fm.dto.SalaryDTO;
import com.groupware.approval.dto.DeptTreeDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface FmMapper {

    @Select("SELECT * FROM department")
    List<DeptTreeDTO> getDepartments();

    @Select("WITH RECURSIVE SubDepartments AS ( " +
            "SELECT department_id " +
            "FROM department " +
            "WHERE department_id = #{departmentId} " +
            "UNION ALL " +
            "SELECT d.department_id " +
            "FROM department d " +
            "INNER JOIN SubDepartments sd ON d.parent_department_id = sd.department_id " +
            ") " +
            "SELECT s.salary_id AS salaryId, " +
            "s.employee_code AS employeeCode, " +
            "s.description, " +
            "s.hiredate, " +
            "s.amount, " +
            "d.department_name AS departmentName, " +
            "p.ps_nm AS positionName " +
            "FROM salary s " +
            "JOIN employee e ON s.employee_code = e.employee_code " +
            "JOIN department d ON e.department_id = d.department_id " +
            "JOIN positions p ON e.ps_cd = p.ps_cd " +
            "WHERE e.department_id IN (SELECT department_id FROM SubDepartments)")
    List<SalaryDTO> getSalariesByDepartment(@Param("departmentId") int departmentId);


    @Select("SELECT password FROM employee WHERE username = #{username}")
    String getPasswordByUsername(@Param("username") String username);

}
