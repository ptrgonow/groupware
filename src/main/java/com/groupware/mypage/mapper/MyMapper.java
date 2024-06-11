package com.groupware.mypage.mapper;

import com.groupware.mypage.dto.TodoDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MyMapper {

    @Select("SELECT content, employee_code AS employeeCode, created_at AS createdAt, status FROM todo WHERE employee_code = #{employeeCode} ORDER BY created_at DESC")
    List<TodoDTO> getAllTodoList(String employeeCode);


    @Insert("INSERT INTO todo (content, employee_code, created_at, status) VALUES (#{content}, #{employeeCode}, NOW(), default)")
    boolean addTodo(TodoDTO todo);

}
