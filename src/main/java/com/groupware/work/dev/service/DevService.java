package com.groupware.work.dev.service;

import com.groupware.work.dev.dto.*;
import com.groupware.work.dev.mapper.DevMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DevService {

    private final DevMapper workMapper;

    @Autowired
    public DevService(DevMapper workMapper) {
        this.workMapper = workMapper;
    }

    public List<ProjectDTO> getProjects(String employee_code) {

        return workMapper.getProjects(employee_code);
    }

    public List<ProjectFeedDTO> getFeed(int projectId) {

        return workMapper.getFeed(projectId);
    }

    public ProjectDTO getProjectInfo(int projectId){

        return workMapper.getProjectInfo(projectId);
    }

    public List<ProjectMemberDTO> getProjectMembers(int projectId) {
        return workMapper.getProjectMembers(projectId);
    }

    public List<ProjectTaskDTO> getProjectTasks(int projectId){
        return workMapper.getProjectTasks(projectId);
    }

    public List<ProjectEditDTO> editProject(int projectId) {
        return workMapper.editProject(projectId);
    }
}
