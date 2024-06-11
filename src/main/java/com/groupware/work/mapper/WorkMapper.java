package com.groupware.work.mapper;

import com.groupware.work.dev.dto.ProjectDTO;
import com.groupware.work.dev.dto.ProjectFeedDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface WorkMapper {

    @Select("select * from projects")
    List<ProjectDTO> getProjects(

    );

    @Select("SELECT pf.project_id, pf.feed_content, e.name, pf.create_at " +
            "FROM project_feed pf " +
            "JOIN employee e ON pf.employee_code = e.employee_code " +
            "WHERE pf.project_id = #{project_id} " +
            "ORDER BY pf.feed_id")
    List<ProjectFeedDTO> getFeed(@Param("project_id") int projectId);

}
