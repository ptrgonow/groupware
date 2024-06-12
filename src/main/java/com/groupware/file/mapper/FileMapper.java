package com.groupware.file.mapper;

import com.groupware.file.dto.FileDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface FileMapper {

    @Select("SELECT t.id, t.file_cd AS fileCd , t.title, t.file_url AS fileUrl, t.created_by AS createdBy, d.department_name AS departmentName, t.created_at AS createdAt, t.updated_at AS updatedAt " +
            "FROM templates t " +
            "JOIN department d ON t.created_by = d.department_id")
    List<FileDTO> selectAll();

    @Select("SELECT t.id, t.file_cd AS fileCd , t.title, t.file_url AS fileUrl, t.created_by AS createdBy, d.department_name AS departmentName, t.created_at AS createdAt, t.updated_at AS updatedAt " +
            "FROM templates t " +
            "JOIN department d ON t.created_by = d.department_id " +
            "WHERE t.title LIKE CONCAT('%', #{title}), '%'")
    List<FileDTO> searchList();

}
