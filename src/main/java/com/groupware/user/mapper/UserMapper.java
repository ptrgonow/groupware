package com.groupware.user.mapper;

import com.groupware.user.dto.UserDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {

    @Select("SELECT employee_code AS employeeCode, name, birth_date AS birthDate, address, department_id AS departmentId, position, status, created_at AS createdAt, username FROM employee WHERE employee_code = #{employeeCode}")
    UserDTO findUserByEmployeeCode(String employeeCode);

    @Insert("INSERT INTO employee (employee_code, name, birth_date, address, department_id, position, status, created_at, username, password) VALUES (#{employeeCode}, #{name}, #{birthDate}, #{address}, #{departmentId}, #{position}, #{status}, #{createdAt}, #{username}, #{password})")
    int insertUser(UserDTO user);
}
