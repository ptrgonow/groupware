package com.groupware.file.mapper;

import com.groupware.file.dto.FileDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface FileMapper {

    // 전체 가져오기
    @Select("SELECT t.id, t.file_cd AS fileCd , t.title, t.file_url AS fileUrl, t.created_by AS createdBy, d.department_name AS departmentName, t.created_at AS createdAt, t.updated_at AS updatedAt " +
            "FROM templates t " +
            "JOIN department d ON t.created_by = d.department_id " +
            "ORDER BY t.file_cd DESC")
    List<FileDTO> selectAll();

    // 해당 글자 포함한 검색된 부분만 가져오기
    @Select("SELECT t.id, t.file_cd AS fileCd , t.title, t.file_url AS fileUrl, t.created_by AS createdBy, d.department_name AS departmentName, t.created_at AS createdAt, t.updated_at AS updatedAt " +
            "FROM templates t " +
            "JOIN department d ON t.created_by = d.department_id " +
            "WHERE t.title LIKE CONCAT('%', #{title}, '%')")
    List<FileDTO> searchList(@Param("title") String title);

}
