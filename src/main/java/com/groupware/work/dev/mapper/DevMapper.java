package com.groupware.work.dev.mapper;

import com.groupware.work.dev.dto.*;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface DevMapper {

    @Select("SELECT DISTINCT p.project_id AS projectId, p.project_name AS projectName, p.start_date AS startDate, p.end_date AS endDate, " +
            "p.status, p.department_id AS departmentId, p.description, p.created_at AS createAt, pm.employee_code AS employeeCode " +
            "FROM projects p " +
            "LEFT JOIN project_members pm ON p.project_id = pm.project_id " +
            "WHERE p.project_id = #{projectId}")
    List<ProjectDetailsDTO> getProjectInfo(@Param("projectId") int projectId);

    @Select("SELECT m.project_member_id AS memberId, m.employee_code AS memberEmployeeCode, e.name AS memberName, " +
            "d.department_name AS memberDepartmentName, ps.ps_nm AS memberPosition " +
            "FROM project_members m " +
            "LEFT JOIN employee e ON m.employee_code = e.employee_code " +
            "LEFT JOIN department d ON e.department_id = d.department_id " +
            "LEFT JOIN positions ps ON e.ps_cd = ps.ps_cd " +
            "WHERE m.project_id = #{projectId}")
    List<ProjectMemberDTO> getProjectMembers(@Param("projectId") int projectId);

    @Select("SELECT t.project_task_id AS taskId, t.task_content AS taskContent, t.employee_code AS taskEmployeeCode, t.progress AS taskProgress, te.name AS taskEmployeeName " +
            "FROM project_tasks t " +
            "LEFT JOIN employee te ON t.employee_code = te.employee_code " +
            "WHERE t.project_id = #{projectId}")
    List<ProjectTaskDTO> getProjectTasks(@Param("projectId") int projectId);

    @Select("SELECT p.project_id AS projectId, p.project_name AS projectName, p.start_date AS startDate, p.end_date AS endDate, " +
            "p.status, p.department_id AS departmentId, p.description, p.created_at AS createAt, pm.employee_code AS employeeCode " +
            "FROM projects p " +
            "JOIN project_members pm ON p.project_id = pm.project_id " +
            "JOIN employee e ON pm.employee_code = e.employee_code " +
            "WHERE pm.employee_code = #{employeeCode}")
    List<ProjectDTO> getProjects(@Param("employeeCode") String employeeCode);
}
