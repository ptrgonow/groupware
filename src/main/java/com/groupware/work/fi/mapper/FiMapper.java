package com.groupware.work.fi.mapper;

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


}
