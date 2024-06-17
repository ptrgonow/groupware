package com.groupware.work.dev.service;

import com.groupware.work.dev.dto.*;
import com.groupware.work.dev.mapper.DevMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public void updateProjects(ProjectDTO projectDTO, List<ProjectMemberDTO> members, List<ProjectTaskDTO> tasks) {
        int projectId = projectDTO.getProject_id(); // 프로젝트 ID 추출

        workMapper.updateProject(projectDTO);
        // 2. 프로젝트 멤버 업데이트
        for (ProjectMemberDTO memberDTO : members) {


            memberDTO.setProject_id(projectId);
            memberDTO.setEmployee_code(memberDTO.getEmployee_code());
            memberDTO.setProject_member_id(memberDTO.getProject_member_id());
            memberDTO.setName(memberDTO.getName());

            workMapper.updateMember(members);
        }

        for (ProjectTaskDTO taskDTO : tasks) {

            taskDTO.setProject_id(projectId);
            taskDTO.setEmployee_code(taskDTO.getEmployee_code());
            taskDTO.setProject_task_id(taskDTO.getProject_task_id());
            taskDTO.setProgress(taskDTO.getProgress());

            workMapper.updateTask(projectId, taskDTO);

        }

    }
}