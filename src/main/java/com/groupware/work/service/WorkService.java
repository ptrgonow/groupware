package com.groupware.work.service;

import com.groupware.work.dev.dto.ProjectDTO;
import com.groupware.work.dev.dto.ProjectFeedDTO;
import com.groupware.work.mapper.WorkMapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkService {

    private final WorkMapper workMapper;

    @Autowired
    public WorkService(WorkMapper workMapper) {
        this.workMapper = workMapper;
    }

    public List<ProjectDTO> getProjects() {

        return workMapper.getProjects();
    }

    public List<ProjectFeedDTO> getFeed(int projectId) {

        return workMapper.getFeed(projectId);
    }
}
