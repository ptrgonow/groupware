package com.groupware.work.ceo.mapper;

import com.groupware.approval.dto.ApprovalDTO;
import com.groupware.file.dto.FileDTO;
import com.groupware.work.dev.dto.ProjectDTO;
import com.groupware.work.ms.dto.AllEmployeeDTO;
import com.groupware.work.ms.dto.MsApprovalDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CeoMapper {

    // 내가 처리해야 할 결재 목록을 가져오는 쿼리문
    @Select("SELECT t.title AS fileCd, e.name AS employeeName, a.status, a.created_at AS createdAt FROM approval a JOIN approval_path ap ON a.approval_id = ap.approval_id JOIN employee e ON a.employee_code = e.employee_code JOIN templates t ON a.file_cd = t.file_cd WHERE ap.employee_code = #{employeeCode} AND ap.status = '미결'")
    List<ApprovalDTO> selectMyPendingApprovals(String employeeCode);


    // 인사
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
            "ORDER BY status DESC;")
    List<AllEmployeeDTO> getAllEmployee();


    // 재무


    // 개발
    @Select("select project_id as projectId, project_name as ProjectName, start_date as startDate, " +
            "end_date as endDate, status, description, created_at as createdAt from projects order by project_id desc")
    public List<ProjectDTO> getProjects();



}
