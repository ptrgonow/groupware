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
            "WHERE t.project_id = #{projectId} " +
            "ORDER BY t.created_at DESC")
    List<ProjectTaskDTO> getProjectTasks(@Param("projectId") int projectId);

    @Select("SELECT p.project_id AS projectId, p.project_name AS projectName, p.start_date AS startDate, p.end_date AS endDate, " +
            "p.status, p.department_id AS departmentId, p.description, p.created_at AS createAt, pm.employee_code AS employeeCode " +
            "FROM projects p " +
            "JOIN project_members pm ON p.project_id = pm.project_id " +
            "JOIN employee e ON pm.employee_code = e.employee_code " +
            "WHERE pm.employee_code = #{employeeCode} " +
            "ORDER BY p.created_at DESC")
    List<ProjectDTO> getProjects(@Param("employeeCode") String employeeCode);

    // feed 가져오기
    @Select("SELECT f.feed_id AS feedId, f.employee_code AS employeeCode, f.content AS content, e.name AS name, f.created_at AS createdAt, " +
            "e.ps_cd AS psCd, ps.ps_nm AS psNm " +
            "FROM project_feeds f " +
            "JOIN employee e ON f.employee_code = e.employee_code " +
            "JOIN positions ps ON e.ps_cd = ps.ps_cd " +
            "WHERE f.project_id = #{projectId} " +
            "ORDER BY f.created_at DESC")
    List<ProjectFeedDTO> getFeeds(@Param("projectId") int projectId);


    @Update("UPDATE projects SET project_name = #{project.projectName}, description = #{project.description}, " +
            "start_date = #{project.startDate}, end_date = #{project.endDate}, status = #{project.status}, " +
            "department_id = #{project.departmentId} " +
            "WHERE project_id = #{project.projectId}")
    void updateProject(@Param("project") ProjectDTO project);

    @Update("UPDATE project_members SET employee_code = #{member.memberEmployeeCode} " +
            "WHERE project_member_id = #{member.memberId} AND project_id = #{projectId}")
    void updateProjectMember(@Param("projectId") int projectId, @Param("member") ProjectMemberDTO member);

    @Update("UPDATE project_tasks SET task_content = #{task.taskContent}, employee_code = #{task.taskEmployeeCode}, " +
            "progress = #{task.taskProgress} " +
            "WHERE project_task_id = #{task.taskId} AND project_id = #{projectId}")
    void updateProjectTask(@Param("projectId") int projectId, @Param("task") ProjectTaskDTO task);

    @Insert("INSERT INTO project_feeds (project_id, employee_code, content, created_at) VALUES (#{projectId}, #{employeeCode}, #{content}, NOW())")
    void addFeed(ProjectFeedDTO feed);
    
    @Insert("INSERT INTO project_tasks (project_id, task_content, employee_code, progress, created_at) VALUES (#{projectId}, #{taskContent}, #{taskEmployeeCode}, #{taskProgress}, NOW())")
    void addTask(ProjectTaskDTO task);

    @Delete("DELETE FROM project_tasks WHERE project_task_id = #{taskId}")
    void deleteTask(int taskId);

    @Insert("INSERT INTO webhook_data (payload, created_at) VALUES (#{payload}, #{createdAt})")
    void saveGitHook(GitHookDTO gitHookDTO);

    @Select("SELECT payload, created_at AS createdAt FROM webhook_data")
    List<GitHookDTO> getGitHookData( );
}


