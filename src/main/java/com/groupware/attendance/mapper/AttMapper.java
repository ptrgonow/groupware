package com.groupware.attendance.mapper;

import com.groupware.attendance.dto.AttDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Mapper
public interface AttMapper {

    @Insert("INSERT INTO attendance (employee_code, check_in, status, created_at) VALUES (#{employeeCode}, #{checkIn}, #{status}, NOW())")
    void insertCheckIn(AttDTO attDTO);

    @Update("UPDATE attendance SET check_out = #{checkOut}, status = #{status} WHERE employee_code = #{employeeCode} AND check_out IS NULL")
    void updateCheckOut(AttDTO attDTO);

    @Select("SELECT employee_code AS employeeCode, check_in AS checkIn, check_out AS checkOut, status FROM attendance WHERE employee_code = #{employeeCode} ORDER BY created_at DESC LIMIT 1")
    Optional<AttDTO> getAttendanceStatus(String employeeCode);

    @Select("SELECT check_in AS checkIn, check_out AS checkOut FROM attendance WHERE employee_code = #{employeeCode} ORDER BY created_at DESC")
    List<AttDTO> getAttendanceRecords(String employeeCode);

    @Select("SELECT employee_code AS employeeCode, DATE(check_in) AS attendanceDate, MIN(check_in) AS firstCheckIn, MAX(check_out) AS lastCheckOut " +
            "FROM attendance " +
            "WHERE employee_code = #{employeeCode} " +
            "GROUP BY employee_code, DATE(check_in) " +
            "ORDER BY attendanceDate DESC")
    List<AttDTO> getFirstAndLastAttendance(String employeeCode);

}
