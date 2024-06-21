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
    public void updateProject(ProjectDTO projectDTO, List<ProjectMemberDTO> members, List<ProjectTaskDTO> tasks, List<Long> deletedMembers) {
        // 프로젝트 업데이트
        devMapper.updateProject(projectDTO);

        // 멤버 업데이트 또는 추가
        for (ProjectMemberDTO member : members) {
            if (member.getMemberId() == 0) {
                // memberId가 없는 경우, 새로운 멤버 추가
                devMapper.insertProjectMember(projectDTO.getProjectId(), member.getMemberEmployeeCode());
            } else {
                // memberId가 있는 경우, 기존 멤버 업데이트
                devMapper.updateProjectMember(projectDTO.getProjectId(), member);
            }
        }

        // 삭제된 멤버 처리
        for (Long memberId : deletedMembers) {
            devMapper.deleteProjectMember(memberId, projectDTO.getProjectId());
        }

        // 작업 업데이트
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

    public void deleteProject(int projectId) {
        devMapper.deleteProject(projectId);
    }
}
