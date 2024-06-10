package com.groupware.attendance.mapper;

import com.groupware.attendance.dto.AttDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;
import java.util.Optional;

@Mapper
public interface AttMapper {

    @Insert("INSERT INTO attendance (employee_code, check_in, status, created_at) VALUES (#{employeeCode}, #{checkIn}, #{status}, NOW())")
    void insertCheckIn(AttDTO attDTO);

    @Update("UPDATE attendance SET check_out = #{checkOut}, status = #{status} WHERE employee_code = #{employeeCode} AND check_out IS NULL")
    void updateCheckOut(AttDTO attDTO);

    @Select("SELECT employee_code AS employeeCode, check_in AS checkIn, check_out AS checkOut, status, created_at AS createdAt FROM attendance WHERE employee_code = #{employeeCode} ORDER BY created_at DESC LIMIT 1")
    Optional<AttDTO> getAttendanceStatus(String employeeCode);

    @Select("SELECT employee_code AS employeeCode, check_in AS checkIn, check_out AS checkOut, status, created_at AS createdAt FROM attendance WHERE employee_code = #{employeeCode} ORDER BY created_at DESC")
    List<AttDTO> getAttendanceRecords(String employeeCode);
}
