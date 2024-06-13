package com.groupware.notice.mapper;

import com.groupware.notice.dto.NoticeDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface NoticeMapper {

    @Select("SELECT notice_id, title, content, created_at, employee_code FROM notice")
    List<NoticeDTO> getAllNotices();

    @Insert("INSERT INTO notice (title, content, created_at, employee_code) " +
            "VALUES (#{title}, #{content}, #{created_at}, #{employee_code})")
    void insertNotice(NoticeDTO noticeDTO);

}
