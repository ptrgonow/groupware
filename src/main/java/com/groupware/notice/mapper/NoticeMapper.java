package com.groupware.notice.mapper;

import com.groupware.notice.dto.NoticeDTO;
import org.apache.ibatis.annotations.*;

import java.util.List;

// NoticeMapper.java

@Mapper
public interface NoticeMapper {

 @Select("SELECT n.notice_id AS noticeId, n.title AS title, n.content AS content, " +
         "n.created_at AS createdAt, n.employee_code AS employeeCode, d.department_name AS departmentName " +
         "FROM notice n " +
         "JOIN employee e ON n.employee_code = e.employee_code " +
         "JOIN department d ON e.department_id = d.department_id " +
         "ORDER BY n.notice_id DESC")
 List<NoticeDTO> getAllNotices();


 @Insert("INSERT INTO notice (title, content, created_at, employee_code) " +
         "VALUES (#{title}, #{content}, now(), #{employeeCode})") // employee_code -> employeeCode
 void insertNotice(NoticeDTO noticeDTO);

 @Update("UPDATE notice SET title = #{title}, content = #{content} WHERE notice_id = #{noticeId}") // notice_id -> noticeId
 void updateNotice(NoticeDTO noticeDTO);

 @Delete("DELETE FROM notice WHERE notice_id = #{noticeId}") // id -> noticeId
 void deleteNotice(int noticeId); // id -> noticeId

 @Select("SELECT notice_id AS noticeId, title, content, created_at AS createdAt FROM notice WHERE notice_id = #{noticeId}") // notice_id -> noticeId, created_at -> createdAt
 NoticeDTO getNoticeById(int noticeId);
}

