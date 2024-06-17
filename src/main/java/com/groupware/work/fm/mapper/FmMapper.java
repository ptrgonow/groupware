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

    @Select("SELECT s.salary_id AS salaryId, " +
            "s.employee_code AS employeeCode, " +
            "s.description, " +
            "s.amount, " +
            "s.hiredate, " +
            "d.department_name AS departmentName, " +
            "p.ps_nm AS positionName " +
            "FROM salary s " +
            "JOIN employee e ON s.employee_code = e.employee_code " +
            "JOIN department d ON e.department_id = d.department_id " +
            "JOIN positions p ON e.ps_cd = p.ps_cd " +
            "WHERE e.department_id = #{departmentId}")
    List<SalaryDTO> getSalariesByDepartment(@Param("departmentId") int departmentId);

}
