package com.groupware.work.ms.mapper;

import com.groupware.approval.dto.ApprovalDTO;
import com.groupware.work.ms.dto.AllEmployeeDTO;
import com.groupware.work.ms.dto.MsApprovalDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MsMapper {

    @Select("SELECT " +
            "    e.name AS employeeName, " +
            "    d.department_name AS departmentName, " +
            "    p.ps_nm AS positionName, " +
            "   COALESCE(( " +
            "        SELECT a.status " +
            "        FROM attendance a " +
            "        WHERE a.employee_code = e.employee_code " +
            "        ORDER BY a.created_at DESC " +
            "        LIMIT 1" +
            "             ), '미출근') AS status " +
            "FROM employee e " +
            "         LEFT JOIN department d ON e.department_id = d.department_id " +
            "         LEFT JOIN positions p ON e.ps_cd = p.ps_cd " +
            "GROUP BY e.employee_code, e.name, d.department_name, p.ps_nm " +
            "ORDER BY status desc;")
    List<AllEmployeeDTO> getAllEmployee();
    
    @Select("SELECT " +
            "    t.title AS title, " +
            "    e.name AS name, " +
            "    a.created_at AS createdAt, " +
            "    a.status AS status " +
            "FROM approval a " +
            "JOIN templates t ON a.file_cd = t.file_cd AND t.created_by = 9 " +
            "JOIN employee e ON a.employee_code = e.employee_code " +
            "ORDER BY a.created_at DESC;")
    List<MsApprovalDTO> getApproval();

    @Select("SELECT " +
            "    t.title AS title, " +
            "    e.name AS name, " +
            "    a.created_at AS createdAt, " +
            "    a.status AS status " +
            "FROM approval a " +
            "JOIN templates t ON a.file_cd = t.file_cd AND t.created_by = 10 " +
            "JOIN employee e ON a.employee_code = e.employee_code " +
            "ORDER BY a.created_at DESC;")
    List<MsApprovalDTO> getFmApproval();

    @Select("SELECT " +
            "    t.title AS title, " +
            "    e.name AS name, " +
            "    a.created_at AS createdAt, " +
            "    a.status AS status " +
            "FROM approval a " +
            "JOIN templates t ON a.file_cd = t.file_cd " +
            "JOIN employee e ON a.employee_code = e.employee_code " +
            "WHERE DATE(a.created_at) = CURDATE() " + // 오늘 날짜인 항목만 필터링
            "ORDER BY a.created_at DESC;")
    List<MsApprovalDTO> getNewApproval();



}
