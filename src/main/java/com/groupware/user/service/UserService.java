package com.groupware.user.service;

import com.groupware.user.dto.*;
import com.groupware.user.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserMapper userMapper;

    @Autowired
    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public UserDTO getUserDetails(String employeeCode) {
        UserDTO user = userMapper.findUserByEmployeeCode(employeeCode);
        if (user != null) {
            DeptDTO department = userMapper.findDepartmentById(user.getDepartmentId());
            user.setDepartmentName(department.getDepartmentName());
        }
        return user;
    }

    @Transactional
    public void registerUser(UserDTO user) {
        // employee_code 중복 체크
        int employeeCodeCount = userMapper.countByEmployeeCode(user.getEmployeeCode());
        if (employeeCodeCount > 0) {
            // DuplicateKeyException: 중복 키 문제를 명확하게 구분
            throw new DuplicateKeyException("이미 존재하는 사원번호입니다.");
        }

        // username 중복 체크
        int usernameCount = userMapper.countByUsername(user.getUsername());
        if (usernameCount > 0) {
            throw new DuplicateKeyException("이미 존재하는 아이디입니다.");
        }

        // 유저 등록
        int result = userMapper.insertUser(user);
        if (result != 1) {
            throw new RuntimeException("유저 등록 실패");
        }
    }

    public List<DeptDTO> getAllDepartments() {
        List<DeptDTO> departments = userMapper.getAllDepartments();
        logger.info("Fetched all departments: {}", departments);
        return departments;
    }

    public UserDTO authenticate(String username, String password) {
        UserDTO user = userMapper.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            DeptDTO department = userMapper.findDepartmentById(user.getDepartmentId());
            user.setDepartmentName(department.getDepartmentName());
            return user;
        }
        return null;
    }

    public List<PositionDTO> getAllPositions( ) {
        List<PositionDTO> positions = userMapper.getAllPositions();
        logger.info("Fetched all positions: {}", positions);
        return positions;
    }

    public boolean updateUser(UserUpdateDTO user) {
        int result = userMapper.updateUser(user);
        if (result == 1) {
            logger.info("유저 정보 수정 성공: {}", user);
            return true;
        } else {
            logger.error("유저 정보 수정 실패: {}", user);
            return false;
        }
    }

    public List<PrMemDTO> getAllEmployees() {
        List<PrMemDTO> employees = userMapper.getAllEmployees();
        logger.info("Fetched all employees: {}", employees);
        return employees;
    }

}
