package com.groupware.work.dev.service;

import com.groupware.work.dev.dto.*;
import com.groupware.work.dev.mapper.DevMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public ProjectDetailsDTO getProjectDetails(int projectId) {
        List<ProjectDetailsDTO> projectDetailsList = devMapper.getProjectInfo(projectId);
        if (projectDetailsList.isEmpty()) {
            return null;
        }
        ProjectDetailsDTO projectDetails = projectDetailsList.get(0);
        List<ProjectMemberDTO> members = devMapper.getProjectMembers(projectId);
        List<ProjectTaskDTO> tasks = devMapper.getProjectTasks(projectId);
        List<ProjectFeedDTO> feeds = devMapper.getFeeds(projectId);
        projectDetails.setMembers(members);
        projectDetails.setTasks(tasks);
        projectDetails.setFeeds(feeds);
        return projectDetails;
    }

    @Transactional
    public void updateProject(ProjectDTO projectDTO, List<ProjectMemberDTO> members, List<ProjectTaskDTO> tasks) {

        devMapper.updateProject(projectDTO);

        for (ProjectMemberDTO member : members) {
            ProjectMemberDTO memberDTO = new ProjectMemberDTO();
            memberDTO.setMemberId(member.getMemberId());
            memberDTO.setMemberEmployeeCode(member.getMemberEmployeeCode());
            devMapper.updateProjectMember(projectDTO.getProjectId(), member);
        }

        for (ProjectTaskDTO task : tasks) {
            ProjectTaskDTO taskDTO = new ProjectTaskDTO();
            taskDTO.setTaskId(task.getTaskId());
            taskDTO.setTaskContent(task.getTaskContent());
            taskDTO.setTaskEmployeeCode(task.getTaskEmployeeCode());
            taskDTO.setTaskProgress(task.getTaskProgress());
            devMapper.updateProjectTask(projectDTO.getProjectId(), task);
        }

    }

    @Transactional
    public void addFeed(ProjectFeedDTO feed) {
        devMapper.addFeed(feed);
    }

    @Transactional
    public void addTask(ProjectTaskDTO task) {
        devMapper.addTask(task);
    }

    public void deleteTask(int taskId) {
        devMapper.deleteTask(taskId);
    }

    @Transactional
    public void saveGitHook(GitHookDTO gitHookDTO) {
        devMapper.saveGitHook(gitHookDTO);
    }

    public List<GitHookDTO> getGitHookData( ) {
        return devMapper.getGitHookData();
    }

    @Transactional
    public void insertProject(ProjectDTO project) {
        // 프로젝트 정보 삽입
        devMapper.insertProject(project);

        // 프로젝트 멤버 삽입
        devMapper.insertProjectMember(project.getProjectId(), project.getEmployeeCode());
    }
}
