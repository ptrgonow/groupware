package com.groupware.file.mapper;

import com.groupware.file.dto.FileDTO;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface FileMapper {

    // 전체 가져오기
    @Select("SELECT t.id, t.file_cd AS fileCd , t.title, t.file_url AS fileUrl, t.created_by AS createdBy, d.department_name AS departmentName, t.created_at AS createdAt, t.updated_at AS updatedAt " +
            "FROM templates t " +
            "JOIN department d ON t.created_by = d.department_id " +
            "ORDER BY t.id DESC")
    List<FileDTO> selectAll();

    // 해당 글자 포함한 검색된 부분만 가져오기
    @Select("SELECT t.id, t.file_cd AS fileCd , t.title, t.file_url AS fileUrl, t.created_by AS createdBy, d.department_name AS departmentName, t.created_at AS createdAt, t.updated_at AS updatedAt " +
            "FROM templates t " +
            "JOIN department d ON t.created_by = d.department_id " +
            "WHERE t.title LIKE CONCAT('%', #{title}, '%')")
    List<FileDTO> searchList(@Param("title") String title);

    // 문서 등록
    @Insert("INSERT INTO templates(title, file_url, created_by, created_at, updated_at, file_cd) " +
            "VALUES(#{title}, null, #{createdBy}, NOW(), NOW(), #{fileCd})")
    void insertFile(FileDTO file);

    // 문서 등록 시 중복된 fileCd 확인
    @Select("SELECT count(*) > 0 FROM templates " +
            "WHERE file_cd = #{fileCd}")
    boolean existFileCd(@Param("fileCd") String fileCd);

    // 문서 등록 시 중복된 문서명 확인
    @Select("SELECT count(*) > 0 FROM templates " +
            "WHERE title = #{title}")
    boolean existFileTitle(@Param("title") String title);

    // 문서 삭제
    @Delete("DELETE FROM templates WHERE id=#{id}")
    void deleteFile(int id);

}
