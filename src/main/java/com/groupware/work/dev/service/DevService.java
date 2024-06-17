package com.groupware.work.dev.service;

import com.groupware.work.dev.dto.*;
import com.groupware.work.dev.mapper.DevMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DevService {

    private final DevMapper devMapper;

    @Autowired
    public DevService(DevMapper devMapper) {
        this.devMapper = devMapper;
    }

    public List<ProjectDTO> getProjects(String employeeCode) {
        return devMapper.getProjects(employeeCode);
    }

    public ProjectDetailsDTO getProjectDetails(int projectId) {
        List<ProjectDetailsDTO> projectDetailsList = devMapper.getProjectInfo(projectId);
        System.out.println("=======================================");
        System.out.println(projectDetailsList);
        System.out.println("=======================================");
        if (projectDetailsList.isEmpty()) {
            return null;
        }
        ProjectDetailsDTO projectDetails = projectDetailsList.get(0);
        List<ProjectMemberDTO> members = devMapper.getProjectMembers(projectId);
        List<ProjectTaskDTO> tasks = devMapper.getProjectTasks(projectId);
        projectDetails.setMembers(members);
        projectDetails.setTasks(tasks);
        return projectDetails;
    }
}
