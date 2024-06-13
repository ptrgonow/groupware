package com.groupware.notice.mapper;

import com.groupware.notice.dto.NoticeDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface NoticeMapper {

    @Select("SELECT notice_id, title, content, created_at, employee_code FROM notice order by notice_id desc")
    List<NoticeDTO> getAllNotices();

    @Insert("INSERT INTO notice (title, content, created_at, employee_code) " +
            "VALUES (#{title}, #{content}, #{created_at}, #{employee_code})")
    void insertNotice(NoticeDTO noticeDTO);


    @Select("SELECT n.employee_code " +
            "FROM notice n " +
            "JOIN employee e ON n.employee_code = e.employee_code " +
            "WHERE e.department_id = 3")
    NoticeDTO selectEmployee();



}
