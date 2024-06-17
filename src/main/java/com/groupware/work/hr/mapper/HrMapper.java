package com.groupware.work.hr.mapper;

import com.groupware.work.hr.dto.TodayWorkerDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface HrMapper {

    @Select("SELECT a.employee_code AS employeeCode, " +
            "       e.name AS name, " +
            "       MIN(a.check_in) AS firstCheckIn, " +
            "       MAX(a.check_out) AS lastCheckOut, " +
            "       CASE WHEN MAX(a.check_out) IS NULL THEN '근무중' ELSE '퇴근' END AS status " +
            "FROM attendance a " +
            "JOIN employee e ON a.employee_code = e.employee_code " +
            "WHERE DATE(a.check_in) = CURDATE() " +
            "GROUP BY a.employee_code, e.name " +
            "ORDER BY status DESC, firstCheckIn desc")
    List<TodayWorkerDTO> getTodayWorkers();


}
