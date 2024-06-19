package com.groupware.work.pm.mapper;

import com.groupware.work.dev.dto.ProjectDTO;
import com.groupware.work.pm.dto.PmDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface PmMapper {

    @Select("select project_id as projectId, project_name as ProjectName, start_date as startDate, " +
            "end_date as endDate, status, description, created_at as createdAt from projects order by project_id desc")
    public List<ProjectDTO> getProjects();

    @Select("select m.meeting_id as meetingId, m.meeting_title as meetingTitle, m.meeting_content as meetingContent, " +
            "m.created_at as createdAt, m.employee_code as employeeCode, m.meeting_start_time as meetingStartTime, " +
            "m.meeting_end_time as meetingEndTime , e.name from meetings m " +
            "join employee e on m.employee_code = e.employee_code " +
            "order by created_at desc")
    public List<PmDTO> getMeetings();

    @Insert("INSERT INTO meetings (meeting_title, meeting_content, employee_code, meeting_start_time, meeting_end_time) " +
            "VALUES (#{meetingTitle}, #{meetingContent}, #{employeeCode}, #{meetingStartTime}, #{meetingEndTime})")
    void insertMeeting(PmDTO pmDTO);

    @Update("UPDATE meetings " +
            "SET meeting_title = #{meetingTitle}, " +
            "meeting_content = #{meetingContent}, " +
            "meeting_start_time = #{meetingStartTime}, " +
            "meeting_end_time = #{meetingEndTime} " +
            "WHERE meeting_id = #{meetingId}")
    void updateMeeting(PmDTO pmDTO);

    @Select("SELECT * FROM meetings WHERE meeting_id = #{meetingId}")
    PmDTO getMeetingById(int meetingId);

}
