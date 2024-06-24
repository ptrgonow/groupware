package com.groupware.work.hr.mapper;

import com.groupware.approval.dto.EmployeeDTO;
import com.groupware.user.dto.UserDTO;
import com.groupware.work.hr.dto.*;
import org.apache.ibatis.annotations.*;

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

    // 인사팀이 받은 전자결재 수
    @Select("SELECT COUNT(*) AS total_count " +
            "FROM approval a " +
            "JOIN templates t ON a.file_cd = t.file_cd AND t.created_by = 9 " +
            "JOIN employee e ON a.employee_code = e.employee_code;")
    int HrApprovalCount();

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

    // 인사팀에 요청된 결재
    @Select("SELECT t.title AS title, " +
            "e.name, " +
            "a.created_at AS createdAt," +
            "a.status, d.department_name AS departmentName " +
            "FROM approval a " +
            "JOIN templates t ON a.file_cd = t.file_cd AND t.created_by = 9 " +
            "JOIN employee e ON a.employee_code = e.employee_code " +
            "JOIN department d ON e.department_id = d.department_id " +
            " ORDER BY a.created_at DESC;")
    List<HrApprovalDTO> getHrApproval();

    // P001(관리자)에 해당하는 사원
    @Select("SELECT employee_code AS employeeCode, name, department_id AS departmentId, ps_cd AS psCd FROM employee WHERE ps_cd = 'P001'")
    List<HrEmployeeDTO> getManagerEmployee();

    // hr 메인에서 사원관리 버튼 클릭 시 전체 출력이 될 리스트(대표 제외)
    @Select("SELECT e.employee_code AS employeeCode, e.name, d.department_name AS departmentName, p.ps_nm AS psNm, a.status " +
            "FROM employee e " +
            "JOIN department d ON e.department_id = d.department_id " +
            "JOIN positions p ON e.ps_cd = p.ps_cd " +
            "LEFT JOIN (SELECT a1.employee_code, a1.status " +
            "FROM attendance a1 " +
            "JOIN (SELECT employee_code, MAX(created_at) AS latest " +
            "FROM attendance " +
            "GROUP BY employee_code) a2 ON a1.employee_code = a2.employee_code " +
            "AND a1.created_at = a2.latest) a ON e.employee_code = a.employee_code " +
            "WHERE d.department_name != '대표';")
    List<HrEmplMagDTO> getEmplManagement();

    // 전체 사원의 상태(created_at 기준 상태가 null인 사원도 포함)
    @Select("SELECT e.employee_code AS employeeCode, e.name, a.status, a.created_at AS createdAt " +
            "FROM employee e " +
            "LEFT JOIN attendance a ON e.employee_code = a.employee_code " +
            "AND a.created_at = (SELECT MAX(a2.created_at) " +
            "FROM attendance a2 " +
            "WHERE a2.employee_code = e.employee_code);")
    List<HrStatusDTO> getEmpStatus();

    // 사원번호에 해당하는 직원 상세 정보
    @Select("SELECT e.employee_code AS employeeCode, " +
            "e.name, " +
            "e.birth_date AS birthDate, " +
            "e.hiredate, " +
            "d.department_name AS departmentName, " +
            "p.ps_nm AS psNm " +
            "FROM employee e " +
            "JOIN department d ON e.department_id = d.department_id " +
            "JOIN positions p ON e.ps_cd = p.ps_cd " +
            "WHERE e.employee_code = #{employeeCode}")
    HrEmplMagDTO getEmplInfo(String employeeCode);

    // 사원 정보 수정 시 부서, 직급 출력
    @Select("SELECT department_name AS departmentName " +
            "FROM department " +
            "WHERE department_name NOT IN ('대표')")
    List<String> getDepartments();

    @Select("SELECT ps_nm AS psNm FROM positions")
    List<String> getPositions();

    @Select("SELECT DISTINCT status FROM attendance")
    List<String> getStatuses();

    // created_at을 기준으로 가져온 사원 코드의 상태
    @Select("SELECT e.employee_code, a.status " +
            "FROM employee e " +
            "JOIN attendance a ON e.employee_code = a.employee_code " +
            "JOIN (SELECT employee_code, MAX(created_at) AS latest_created_at " +
            "FROM attendance " +
            "GROUP BY employee_code) AS latest_attendance " +
            "ON a.employee_code = latest_attendance.employee_code AND a.created_at = latest_attendance.latest_created_at;")
    List<HrStatusDTO> empStatues();

    // 사원 삭제
    @Delete("DELETE FROM employee WHERE employee_code = #{employeeCode}")
    void deleteEmployeeByCode(String employeeCode);

    // 사원 정보 업데이트
    @Update("UPDATE employee SET " +
            "employee_code = #{newEmployeeCode}, " +
            "department_id = (SELECT department_id FROM department WHERE department_name = #{departmentName}), " +
            "ps_cd = (SELECT ps_cd FROM positions WHERE ps_nm = #{psNm}) " +
            "WHERE employee_code = #{employeeCode}")
    void updateEmployee(HrEmployeeUpdateDTO employeeUpdateDTO);

    // 사원코드 존재여부 확인
    @Select("SELECT COUNT(*) FROM employee WHERE employee_code = #{employeeCode}")
    int countEmployee(@Param("employeeCode") String employeeCode);

    // 해당 사원코드의 상태 변경
    @Update("UPDATE attendance SET status = #{status}, created_at = NOW() WHERE employee_code = #{employeeCode} AND created_at = (SELECT MAX(created_at) FROM attendance WHERE employee_code = #{employeeCode})")
    int updateStatus(@Param("employeeCode") String employeeCode, @Param("status") String status);

    // attendance 테이블에 employeeCode 존재 여부 확인
    @Select("SELECT COUNT(*) FROM attendance WHERE employee_code = #{employeeCode}")
    int countByEmployeeCode(@Param("employeeCode") String employeeCode);


}
