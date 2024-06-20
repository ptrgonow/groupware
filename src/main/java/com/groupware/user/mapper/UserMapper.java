package com.groupware.user.mapper;

import com.groupware.user.dto.DeptDTO;
import com.groupware.user.dto.PositionDTO;
import com.groupware.user.dto.PrMemDTO;
import com.groupware.user.dto.UserDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface UserMapper {


    // 개발팀 직원 정보를 조회하는 쿼리
    @Select("WITH RECURSIVE SubDepartments AS (" +
            "    SELECT department_id " +
            "    FROM department " +
            "    WHERE department_id IN (4, 7) " +
            "    UNION ALL " +
            "    SELECT d.department_id " +
            "    FROM department d " +
            "    INNER JOIN SubDepartments sd ON d.parent_department_id = sd.department_id " +
            ") " +
            "SELECT e.employee_code AS employeeCode, " +
            "       e.name AS employeeName, " +
            "       d.department_name AS departmentName, " +
            "       p.ps_nm AS positionName " +
            "FROM employee e " +
            "JOIN department d ON e.department_id = d.department_id " +
            "JOIN positions p ON e.ps_cd = p.ps_cd " +
            "WHERE e.department_id IN (SELECT department_id FROM SubDepartments) " +
            "ORDER BY p.ps_cd")
    List<PrMemDTO> getAllEmployees();


    // 사원번호를 통해 직원 정보를 조회하는 쿼리
    @Select("SELECT employee_code AS employeeCode, name, birth_date AS birthDate, address, department_id AS departmentId, ps_cd, status, hiredate AS createdAt, username, password FROM employee WHERE employee_code = #{employeeCode}")
    UserDTO findUserByEmployeeCode(String employeeCode);

    // 직원 정보를 등록하는 쿼리
    @Insert("INSERT INTO employee (employee_code, name, birth_date, address, department_id, ps_cd, status, hiredate, username, password) VALUES (#{employeeCode}, #{name}, #{birthDate}, #{address}, #{departmentId}, #{ps_cd}, '재직중', NOW(), #{username}, #{password})")
    int insertUser(UserDTO user);

    // 아이디를 통해 직원 정보를 조회하는 쿼리
    @Select("SELECT employee_code AS employeeCode, name, birth_date AS birthDate, address, department_id AS departmentId, ps_cd, status, hiredate AS createdAt, username, password FROM employee WHERE username = #{username}")
    UserDTO findByUsername(String username);

    // 부서 정보를 조회하는 쿼리
    @Select("SELECT department_id AS departmentId, department_name AS departmentName, parent_department_id AS parentDepartmentId " +
            "FROM department " +
            "WHERE department_name NOT IN ('대표', '백엔드', '프론트엔드', '데이터 분석')")
    List<DeptDTO> getAllDepartments();

    // 부서 아이디를 통해 부서 정보를 조회하는 쿼리
    @Select("SELECT department_id AS departmentId, department_name AS departmentName, parent_department_id AS parentDepartmentId " +
            "FROM department " +
            "WHERE department_id = #{departmentId}")
    DeptDTO findDepartmentById(int departmentId);

    // 모든 직급 정보를 조회하는 쿼리
    @Select("SELECT ps_cd AS positionCode, ps_nm AS positionName FROM positions")
    List<PositionDTO> getAllPositions( );

    // 직원 정보를 수정하는 쿼리
    @Update("UPDATE employee SET birth_date = #{birthDate}, address = #{address}, username = #{username}, password = #{password} WHERE employee_code = #{employeeCode}")
    int updateUser(UserDTO user);


}
