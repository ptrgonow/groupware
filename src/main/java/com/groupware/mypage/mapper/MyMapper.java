package com.groupware.mypage.mapper;

import com.groupware.mypage.dto.HolidayDTO;
import com.groupware.mypage.dto.TodoDTO;
import com.groupware.user.dto.UserDTO;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MyMapper {

    @Select("SELECT todo_id AS todoId, content, employee_code AS employeeCode, created_at AS createdAt, status FROM todo WHERE employee_code = #{employeeCode} ORDER BY todo_id DESC")
    List<TodoDTO> getAllTodoList(String employeeCode);


    @Insert("INSERT INTO todo (content, employee_code, created_at, status) VALUES (#{content}, #{employeeCode}, NOW(), default)")
    boolean addTodo(TodoDTO todo);

    // 사원번호를 통해 입사일, 연차, 휴가일을 조회하는 쿼리
    @Select("SELECT hiredate, dayoff, vacation FROM employee WHERE employee_code = #{employeeCode}")
    HolidayDTO holidayCount(String employeeCode);

    //  id를 통해 할 일을 삭제하는 쿼리
    @Delete("DELETE FROM todo WHERE todo_id = #{todoId}")
    boolean deleteTodoList(int todoId);


}
