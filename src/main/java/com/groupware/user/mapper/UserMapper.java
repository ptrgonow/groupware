package com.groupware.user.mapper;

import com.groupware.user.dto.DeptDTO;
import com.groupware.user.dto.UserDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface UserMapper {

    // 사원번호를 통해 직원 정보를 조회하는 쿼리
    @Select("SELECT employee_code AS employeeCode, name, birth_date AS birthDate, address, department_id AS departmentId, ps_cd, status, created_at AS createdAt, username FROM employee WHERE employee_code = #{employeeCode}")
    UserDTO findUserByEmployeeCode(String employeeCode);

    // 직원 정보를 등록하는 쿼리
    @Insert("INSERT INTO employee (employee_code, name, birth_date, address, department_id, ps_cd, status, created_at, username, password) VALUES (#{employeeCode}, #{name}, #{birthDate}, #{address}, #{departmentId}, #{position}, '퇴근', NOW(), #{username}, #{password})")
    int insertUser(UserDTO user);

    // 아이디를 통해 직원 정보를 조회하는 쿼리
    @Select("SELECT employee_code AS employeeCode, name, birth_date AS birthDate, address, department_id AS departmentId, ps_cd, status, created_at AS createdAt, username, password FROM employee WHERE username = #{username}")
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
}
