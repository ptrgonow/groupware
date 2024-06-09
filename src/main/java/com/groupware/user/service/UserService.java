package com.groupware.user.service;

import com.groupware.user.dto.UserDTO;
import com.groupware.user.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserMapper userMapper;

    @Autowired
    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public UserDTO getUserInfo(String employeeCode) {
        UserDTO user = userMapper.findUserByEmployeeCode(employeeCode);
        logger.info("Fetched user info: {}", user);
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
}
