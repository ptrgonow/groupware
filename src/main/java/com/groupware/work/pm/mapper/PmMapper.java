package com.groupware.work.pm.mapper;

import com.groupware.work.dev.dto.ProjectDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface PmMapper {

    @Select("select project_id as projectId, project_name as ProjectName, start_date as startDate, " +
            "end_date as endDate, status, description, created_at as createdAt from projects order by project_id desc")
    public List<ProjectDTO> getProjects();
}
