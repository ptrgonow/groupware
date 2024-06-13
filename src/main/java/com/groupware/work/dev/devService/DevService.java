package com.groupware.work.dev.devService;

import com.groupware.work.dev.dto.ProjectDTO;
import com.groupware.work.dev.dto.ProjectFeedDTO;
import com.groupware.work.dev.dto.ProjectMemberDTO;
import com.groupware.work.dev.devMapper.DevMapper;
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

}