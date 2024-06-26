package com.groupware.work.pm.mapper;

import com.groupware.user.dto.PrMemDTO;
import com.groupware.work.dev.dto.ProjectDTO;
import com.groupware.work.pm.dto.MeetingDetailsDTO;
import com.groupware.work.pm.dto.MeetingMemberDTO;
import com.groupware.work.pm.dto.PmDTO;
import org.apache.ibatis.annotations.*;

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

    @Delete("DELETE FROM meeting_member WHERE meeting_member_id = #{memberId} AND meeting_id = #{meetingId}")
    void deleteMeetingMember(Long memberId, int meetingId);

    @Update("UPDATE meeting_member SET employee_code = #{member.employeeCode} " +
            "WHERE meeting_member_id = #{member.memberId} AND meeting_id = #{meetingId}")
    void updateMeetingMember(@Param("meetingId") int meetingId, @Param("member") MeetingMemberDTO member);

    @Insert("INSERT INTO meeting_member (meeting_id, employee_code) VALUES (#{meetingId}, #{employeeCode})")
    void insertMeetingMember(@Param("meetingId") int meetingId, @Param("employeeCode") String employeeCode);


    @Select("select m.meeting_id as meetingId, m.meeting_title as meetingTitle, m.meeting_content as meetingContent, " +
            "m.created_at as createdAt, m.employee_code as employeeCode, m.meeting_start_time as meetingStartTime, " +
            "m.meeting_end_time as meetingEndTime , e.name from meetings m " +
            "join employee e on m.employee_code = e.employee_code where m.meeting_id = #{meetingId}")
    List<MeetingDetailsDTO> getMeetingById(@Param("meetingId") int meetingId);

    @Select("SELECT mm.meeting_member_id AS memberId, mm.employee_code AS employeeCode, e.name AS name, " +
            "d.department_name AS departmentName, p.ps_nm AS positionName " +
            "FROM meeting_member mm " +
            "JOIN employee e ON mm.employee_code = e.employee_code " +
            "LEFT JOIN department d ON e.department_id = d.department_id " +
            "LEFT JOIN positions p ON e.ps_cd = p.ps_cd " +
            "WHERE mm.meeting_id = #{meetingId}")
    List<MeetingMemberDTO> getMeetingMembersByMeetingId(@Param("meetingId") int meetingId);


    @Delete("DELETE FROM meetings WHERE meeting_id = #{meetingId}")
    void deleteMeeting(@Param("meetingId") int meetingId);

    @Delete("DELETE FROM meeting_member WHERE meeting_id = #{meetingId}")
    void deleteMeetingMembersByMeetingId(@Param("meetingId") int meetingId);

    @Select("WITH RECURSIVE SubDepartments AS (" +
            "    SELECT department_id " +
            "    FROM department " +
            "    UNION ALL " +
            "    SELECT d.department_id " +
            "    FROM department d " +
            "    INNER JOIN SubDepartments sd ON d.parent_department_id = sd.department_id " +
            ") " +
            "SELECT e.employee_code AS employeeCode, " +
            "       e.name AS employeeName, " +
            "       d.department_name AS departmentName, " +
            "       p.ps_nm AS positionName " +
            "FROM employee e " +
            "JOIN department d ON e.department_id = d.department_id " +
            "JOIN positions p ON e.ps_cd = p.ps_cd " +
            "WHERE e.department_id IN (SELECT department_id FROM SubDepartments) " +
            "ORDER BY p.ps_cd")
    List<PrMemDTO> getAllEmployees();

}
