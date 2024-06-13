package com.groupware.work.mapper;

import com.groupware.work.dev.dto.ProjectDTO;
import com.groupware.work.dev.dto.ProjectFeedDTO;
import com.groupware.work.dev.dto.ProjectMemberDTO;
import com.groupware.work.dev.dto.ProjectTaskDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface WorkMapper {

    @Select("SELECT p.* " +
            "FROM projects p " +
            "JOIN project_members pm ON p.project_id = pm.project_id " +
            "WHERE pm.employee_code = #{employeeCode}")
    List<ProjectDTO> getProjects(@Param("employeeCode") String employeeCode);


    @Select("SELECT pf.project_id, pf.content, e.name, pf.created_at " +
            "FROM project_feeds pf " +
            "JOIN employee e ON pf.employee_code = e.employee_code " +
            "WHERE pf.project_id = #{project_id} " +
            "ORDER BY pf.feed_id")
    List<ProjectFeedDTO> getFeed(@Param("project_id") int projectId);

    @Select("select description, start_date, end_date from projects " +
            "where project_id = #{project_id}")
    ProjectDTO getProjectInfo(@Param("project_id") int projectId);

    @Select("SELECT e.employee_code, e.name " +
            "FROM project_members pm " +
            "JOIN employee e ON pm.employee_code = e.employee_code " +
            "WHERE pm.project_id = #{projectId}")
    List<ProjectMemberDTO> getProjectMembers(@Param("projectId") int projectId);

    @Select("select pt.*, e.name from project_tasks pt" +
            "join project_members pm on pt.employee_code = pm.employee_code" +
            "where pt.project_id = #{projectId}")
    List<ProjectTaskDTO> getProjectTasks(@Param("projectId") int projectId);

}
