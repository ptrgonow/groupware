package com.groupware.work.hr.mapper;

import com.groupware.approval.dto.EmployeeDTO;
import com.groupware.user.dto.UserDTO;
import com.groupware.work.hr.dto.HrEmployeeDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface HrMapper {

    // 모든 직원 수
    @Select("SELECT count(*) FROM employee")
    int AllEmployeeCount();

    // 전체 인원 현황의 정보
    @Select("SELECT e.employee_code AS employeeCode, e.name, d.department_name AS departmentName, e.department_id AS departmentId, e.ps_cd AS psCd, e.status, e.hiredate, e.username, e.password, e.dayoff, e.vacation, p.ps_nm AS psNm " +
            "FROM employee e " +
            "JOIN department d ON e.department_id = d.department_id " +
            "JOIN positions p ON e.ps_cd = p.ps_cd")
    List<HrEmployeeDTO> getAllEmployees();

    // 미결인 상태의 전자결재 수
    @Select("SELECT count(*) FROM approval")
    int AllApprovalCount();
}
