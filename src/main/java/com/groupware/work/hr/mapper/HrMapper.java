package com.groupware.work.hr.mapper;

import com.groupware.approval.dto.EmployeeDTO;
import com.groupware.user.dto.UserDTO;
import com.groupware.work.hr.dto.HrEmployeeDTO;
import com.groupware.work.hr.dto.TodayWorkerDTO;
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

    // 미결인 상태의 전자결재 수(인사팀에 해당하는 결재 건만 가져와야 함! 수정 필요)
    @Select("SELECT count(*) FROM approval")
    int AllApprovalCount();

    // 금일 근무자 피드
    @Select("SELECT a.employee_code AS employeeCode, " +
            "       e.name AS name, " +
            "       MIN(a.check_in) AS firstCheckIn, " +
            "       MAX(a.check_out) AS lastCheckOut, " +
            "       CASE WHEN MAX(a.check_out) IS NULL THEN '근무중' ELSE '퇴근' END AS status " +
            "FROM attendance a " +
            "JOIN employee e ON a.employee_code = e.employee_code " +
            "WHERE DATE(a.check_in) = CURDATE() " +
            "GROUP BY a.employee_code, e.name " +
            "ORDER BY status DESC, firstCheckIn desc")
    List<TodayWorkerDTO> getTodayWorkers();

    // P001(관리자)에 해당하는 사원
    @Select("SELECT employee_code AS employeeCode, name, department_id AS departmentId, ps_cd AS psCd FROM employee WHERE ps_cd = 'P001'")
    List<HrEmployeeDTO> getManagerEmployee();

}
