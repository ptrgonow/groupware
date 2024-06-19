package com.groupware.notice.mapper;

import com.groupware.notice.dto.NoticeDTO;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface NoticeMapper {

 @Select("SELECT notice_id, title, content, created_at, employee_code FROM notice ORDER BY notice_id DESC")
 List<NoticeDTO> getAllNotices();

 @Insert("INSERT INTO notice (title, content, created_at, employee_code) " +
         "VALUES (#{title}, #{content}, now(), #{employee_code})")
 void insertNotice(NoticeDTO noticeDTO);

 @Select("SELECT n.employee_code " +
         "FROM notice n " +
         "JOIN employee e ON n.employee_code = e.employee_code " +
         "WHERE e.department_id = 3")
 String selectEmployee();

 @Update("UPDATE notice SET title = #{title}, content = #{content} WHERE notice_id = #{notice_id}")
 void updateNotice(NoticeDTO noticeDTO);



 @Select("SELECT notice_id, title, content, created_at FROM notice WHERE notice_id = #{noticeId}")
 NoticeDTO getNoticeById(int noticeId);


 @Delete("DELETE FROM notice WHERE notice_id = #{noticeId}")
 void deleteNotice(int noticeId);


}
