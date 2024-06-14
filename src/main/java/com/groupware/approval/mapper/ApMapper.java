package com.groupware.approval.mapper;


import com.groupware.approval.dto.DeptTreeDTO;
import com.groupware.approval.dto.EmployeeDTO;
import com.groupware.approval.dto.PositionsDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;


@Mapper
public interface ApMapper {

    @Select("SELECT employee_code AS employeeCode, " +
            "name AS name, " +
            "birth_date AS birthDate, " +
            "address AS address, " +
            "department_id AS departmentId, " +
            "ps_cd AS psCd, " +
            "status AS status, " +
            "hiredate AS hiredate, " +
            "username AS username, " +
            "password AS password, " +
            "dayoff AS dayOff, " +
            "vacation AS vacation " +
            "FROM employee")
    List<EmployeeDTO> selectAll( );

    @Select("SELECT department_id AS departmentId, " +
            "department_name AS departmentName, " +
            "parent_department_id AS parentDepartmentId, " +
            "manager_emp_code AS managerEmpCode " +
            "FROM department")
    List<DeptTreeDTO> selectAllDepartment();

    @Select("SELECT ps_id AS psId, " +
            "ps_cd AS psCd, " +
            "ps_nm AS psNm " +
            "FROM positions")
    List<PositionsDTO> selectAllPositions();

}
