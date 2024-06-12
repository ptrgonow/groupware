package com.groupware.schedule.mapper;

import com.groupware.schedule.dto.SchdDTO;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SchdMapper {

    @Select("SELECT schedule_id AS id, title, description, start_time AS startTime, end_time AS endTime, employee_code AS employeeCode, " +
            "department_id AS departmentId, type FROM schedule WHERE employee_code = #{employeeCode}")
    List<SchdDTO> getAllSchedules(String employeeCode);

    @Insert("INSERT INTO schedule (title, description, start_time, end_time, employee_code, department_id, type) " +
            "VALUES (#{title}, #{description}, #{startTime}, #{endTime}, #{employeeCode}, #{departmentId}, #{type})")
    void createSchedule(SchdDTO schedule);

    @Update("UPDATE schedule SET title = #{title}, description = #{description}, start_time = #{startTime}, end_time = #{endTime}, " +
            "employee_code = #{employeeCode}, department_id = #{departmentId}, type = #{type} WHERE schedule_id = #{id}")
    void updateSchedule(SchdDTO schedule);

    @Delete("DELETE FROM schedule WHERE schedule_id = #{id}")
    void deleteSchedule(Long id);
}
