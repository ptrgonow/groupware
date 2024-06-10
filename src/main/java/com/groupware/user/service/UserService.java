package com.groupware.user.service;

import com.groupware.user.dto.DeptDTO;
import com.groupware.user.dto.UserDTO;
import com.groupware.user.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

    public boolean registerUser(UserDTO user) {
        int result = userMapper.insertUser(user);
        if (result == 1) {
            logger.info("유저 등록 성공: {}", user);
            return true;
        } else {
            logger.error("유저 등록 실패: {}", user);
            return false;
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
            return user;
        }
        return null;
    }


}
