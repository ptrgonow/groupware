package com.groupware.notice.mapper;

import com.groupware.notice.dto.NoticeDTO;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface NoticeMapper {

   @Select("SELECT notice_id, title, content, created_at, employee_code FROM notice order by notice_id desc")
    List<NoticeDTO> getAllNotices();

    /* @Select("SELECT notice_id, title, content, DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at FROM notice ORDER BY notice_id DESC")
    List<NoticeDTO> getAllNotices(); */



    @Insert("INSERT INTO notice (title, content, created_at, employee_code) " +
            "VALUES (#{title}, #{content}, now(), #{employee_code})")
    void insertNotice(NoticeDTO noticeDTO);


    @Select("SELECT n.employee_code " +
            "FROM notice n " +
            "JOIN employee e ON n.employee_code = e.employee_code " +
            "WHERE e.department_id = 3")
    NoticeDTO selectEmployee();




    /* 수정 */
    @Update("UPDATE notice SET title = #{title}, content = #{content} WHERE notice_id = #{notice_id}")
    void updateNotice(NoticeDTO noticeDTO);

    /* 삭제 */
    @Delete("DELETE FROM notice WHERE notice_id = #{id}")
    void deleteNotice(int id);

    // 상세
    @Select("SELECT notice_id, title, content, created_at FROM notice WHERE notice_id = #{noticeId}")
    NoticeDTO getNoticeById(int noticeId);


}
