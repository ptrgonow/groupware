package com.groupware.approval.mapper;


import com.groupware.approval.dto.*;
import org.apache.ibatis.annotations.*;

import java.util.List;


@Mapper
public interface ApMapper {

    @Select("SELECT employee_code AS employeeCode, " +
            "name AS name, " +
            "birth_date AS birthDate, " +
            "address AS address, " +
            "department_id AS departmentId, " +
            "ps_cd AS psCd, " +
            "status AS status, " +
            "hiredate AS hiredate, " +
            "username AS username, " +
            "password AS password, " +
            "dayoff AS dayOff, " +
            "vacation AS vacation " +
            "FROM employee")
    List<EmployeeDTO> selectAll( );

    @Select("SELECT department_id AS departmentId, " +
            "department_name AS departmentName, " +
            "parent_department_id AS parentDepartmentId, " +
            "manager_emp_code AS managerEmpCode " +
            "FROM department")
    List<DeptTreeDTO> selectAllDepartment();

    @Select("SELECT ps_id AS psId, " +
            "ps_cd AS psCd, " +
            "ps_nm AS psNm " +
            "FROM positions")
    List<PositionsDTO> selectAllPositions();

    @Select("SELECT file_cd AS docNo, " +
            "title AS docName " +
            "FROM templates")
    List<DocNoDTO> selectAllDocNo( );


    @Select("SELECT * FROM approval WHERE employee_code = #{employeeCode}")
    List<ApprovalDTO> selectMySubmittedApprovals(String employeeCode);

    @Select("SELECT a.* FROM approval a " +
            "JOIN approval_path ap ON a.approval_id = ap.approval_id " +
            "WHERE ap.employee_code = #{employeeCode} AND ap.status = '미결'")
    List<ApprovalDTO> selectMyPendingApprovals(String employeeCode);






    @Insert("INSERT INTO approval (employee_code, file_cd, content, status, created_at, duedate_at) " +
            "VALUES (#{employeeCode}, #{fileCd}, #{content}, #{status}, NOW(), #{duedateAt})")
    @Options(useGeneratedKeys = true, keyProperty = "approvalId")
    void insertApproval(ApprovalDTO approvalDTO);

    @Insert("INSERT INTO approval_path (approval_id, employee_code, sequence, status, file_cd) " +
            "VALUES (#{approvalId}, #{employeeCode}, #{sequence}, #{status}, #{fileCd})")
    void insertApprovalPath(ApprovalPathDTO pathDTO);

    @Insert("INSERT INTO approval_references (approval_id, employee_code) " +
            "VALUES (#{approvalId}, #{employeeCode})")
    void insertApprovalReferences(ApprovalReferencesDTO refDTO);

    @Insert("INSERT INTO approval_consensus (approval_id, employee_code, status, created_at) " +
            "VALUES (#{approvalId}, #{employeeCode}, #{status}, NOW())")
    void insertApprovalConsensus(ApprovalConsensusDTO consensusDTO);

    @Update("UPDATE approval_path SET status = #{status} WHERE approval_id = #{approvalId} AND employee_code = #{employeeCode}")
    void updateApprovalPathStatus(ApprovalPathDTO pathDTO);

    @Update("UPDATE approval SET status = #{status} WHERE approval_id = #{approvalId}")
    void updateApprovalStatus(@Param("approvalId") int approvalId, @Param("status") String status);

    @Select("SELECT * FROM approval_path WHERE approval_id = #{approvalId} AND employee_code = #{employeeCode}")
    ApprovalPathDTO getApprovalPathByApprovalIdAndEmployeeCode(@Param("approvalId") int approvalId, @Param("employeeCode") String employeeCode);

    @Select("SELECT * FROM approval_path WHERE approval_id = #{approvalId} AND sequence > #{sequence}")
    List<ApprovalPathDTO> getNextApprovalPaths(@Param("approvalId") int approvalId, @Param("sequence") int sequence);

    @Select("SELECT * FROM approval_consensus WHERE approval_id = #{approvalId} AND employee_code = #{employeeCode}")
    ApprovalConsensusDTO getApprovalConsensusByApprovalIdAndEmployeeCode(@Param("approvalId") int approvalId, @Param("employeeCode") String employeeCode);

    @Update("UPDATE approval_consensus SET status = #{status} WHERE approval_id = #{approvalId} AND employee_code = #{employeeCode}")
    void updateApprovalConsensusStatus(ApprovalConsensusDTO consensusDTO);

    @Select("SELECT * FROM approval_consensus WHERE approval_id = #{approvalId} AND consensus_id > #{consensusId}")
    List<ApprovalConsensusDTO> getNextApprovalConsensuses(@Param("approvalId") int approvalId, @Param("consensusId") int consensusId);



}
