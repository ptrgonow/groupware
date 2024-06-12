package com.groupware.mypage.service;

import com.groupware.mypage.dto.HolidayDTO;
import com.groupware.mypage.dto.TodoDTO;
import com.groupware.mypage.mapper.MyMapper;
import com.groupware.user.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class MyService {

    private final MyMapper myMapper;

    @Autowired
    public MyService(MyMapper myMapper) {
        this.myMapper = myMapper;
    }

    public List<TodoDTO> getTodoList(String employeeCode) {
        return myMapper.getAllTodoList(employeeCode);
    }

    public Map<String, Object> addTodoList(TodoDTO todo) {
        boolean result = myMapper.addTodo(todo);
        if (result) {
            return Map.of("success", true, "message", "할 일 추가 성공");
        } else {
            return Map.of("success", false, "message", "할 일 추가 실패");
        }
    }

    public HolidayDTO getHolidayList(String employeeCode) {

        return myMapper.holidayCount(employeeCode);
    }


}
