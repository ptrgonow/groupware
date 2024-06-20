package com.groupware.approval.mapper;

import com.groupware.approval.dto.*;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ApMapper {

    // 모든 직원 정보를 가져오는 쿼리문
    @Select("SELECT employee_code AS employeeCode, name AS name, birth_date AS birthDate, address AS address, department_id AS departmentId, ps_cd AS psCd, status AS status, hiredate AS hiredate, username AS username, password AS password, dayoff AS dayOff, vacation AS vacation FROM employee")
    List<EmployeeDTO> selectAll();

    // 모든 부서 정보를 가져오는 쿼리문
    @Select("SELECT department_id AS departmentId, department_name AS departmentName, parent_department_id AS parentDepartmentId, manager_emp_code AS managerEmpCode FROM department")
    List<DeptTreeDTO> selectAllDepartment();

    // 모든 직위 정보를 가져오는 쿼리문
    @Select("SELECT ps_id AS psId, ps_cd AS psCd, ps_nm AS psNm FROM positions")
    List<PositionsDTO> selectAllPositions();

    // 모든 문서 번호와 이름을 가져오는 쿼리문
    @Select("SELECT file_cd AS docNo, title AS docName FROM templates")
    List<DocNoDTO> selectAllDocNo();

    // 내가 상신한 결재 목록을 가져오는 쿼리문
    @Select(
            "SELECT a.approval_id AS approvalId, t.title AS fileCd, e.name AS employeeName, a.status, a.created_at AS createdAt " +
                    "FROM approval a " +
                    "JOIN employee e ON a.employee_code = e.employee_code " +
                    "JOIN templates t ON a.file_cd = t.file_cd " +
                    "WHERE a.employee_code = #{employeeCode} " +
                    "ORDER BY a.created_at DESC"
    )
    List<ApprovalDTO> selectMySubmittedApprovals(String employeeCode);

    // 내가 처리해야 할 결재 목록을 가져오는 쿼리문
    @Select(
            "SELECT a.approval_id AS approvalId, t.title AS fileCd, e.name AS employeeName, ap.status, a.created_at AS createdAt " +
                    "FROM approval a " +
                    "JOIN approval_path ap ON a.approval_id = ap.approval_id " +
                    "JOIN employee e ON a.employee_code = e.employee_code " +
                    "JOIN templates t ON a.file_cd = t.file_cd " +
                    "WHERE ap.employee_code = #{employeeCode} " +
                    "AND (ap.status = '미결' OR ap.status = '후열') " +
                    "AND a.status NOT IN ('완결') " +
                    "ORDER BY a.created_at DESC"
    )
    List<ApprovalDTO> selectMyPendingApprovals(String employeeCode);

    // 결재 정보를 삽입하는 쿼리문
    @Insert(
            "INSERT INTO approval (employee_code, file_cd, content, status, created_at, duedate_at) " +
                    "VALUES (#{employeeCode}, #{fileCd}, #{content}, #{status}, NOW(), #{duedateAt})"
    )
    @Options(useGeneratedKeys = true, keyProperty = "approvalId", keyColumn = "approval_id")
    void insertApproval(ApprovalDTO approvalDTO);

    // 결재 경로 정보를 삽입하는 쿼리문
    @Insert(
            "INSERT INTO approval_path (approval_id, employee_code, sequence, status, file_cd) " +
                    "VALUES (#{approvalId}, #{employeeCode}, #{sequence}, #{status}, #{fileCd})"
    )
    void insertApprovalPath(ApprovalPathDTO pathDTO);

    // 결재 참조 정보를 삽입하는 쿼리문
    @Insert(
            "INSERT INTO approval_references (approval_id, employee_code) " +
                    "VALUES (#{approvalId}, #{employeeCode})"
    )
    void insertApprovalReferences(ApprovalReferencesDTO refDTO);

    // 결재 합의 정보를 삽입하는 쿼리문
    @Insert(
            "INSERT INTO approval_consensus (approval_id, employee_code, status, created_at) " +
                    "VALUES (#{approvalId}, #{employeeCode}, #{status}, NOW())"
    )
    void insertApprovalConsensus(ApprovalConsensusDTO consensusDTO);

    // 결재 경로의 상태를 업데이트하는 쿼리문
    @Update(
            "UPDATE approval_path " +
                    "SET status = #{status} " +
                    "WHERE approval_id = #{approvalId} " +
                    "AND employee_code = #{employeeCode}"
    )
    void updateApprovalPathStatus(ApprovalPathDTO pathDTO);

    // 결재 상태를 업데이트하는 쿼리문
    @Update(
            "UPDATE approval " +
                    "SET status = #{status} " +
                    "WHERE approval_id = #{approvalId}"
    )
    void updateApprovalStatus(@Param("approvalId") int approvalId, @Param("status") String status);

    // 특정 결재 경로 정보를 가져오는 쿼리문
    @Select(
            "SELECT path_id AS pathId, approval_id AS approvalId, employee_code AS employeeCode, sequence, status, file_cd AS fileCd " +
                    "FROM approval_path " +
                    "WHERE approval_id = #{approvalId} " +
                    "AND employee_code = #{employeeCode}"
    )
    ApprovalPathDTO getApprovalPathByApprovalIdAndEmployeeCode(@Param("approvalId") int approvalId, @Param("employeeCode") String employeeCode);

    // 다음 결재 경로 정보를 가져오는 쿼리문
    @Select(
            "SELECT path_id AS pathId, approval_id AS approvalId, employee_code AS employeeCode, sequence, status, file_cd AS fileCd " +
                    "FROM approval_path " +
                    "WHERE approval_id = #{approvalId} " +
                    "AND sequence > #{sequence}"
    )
    List<ApprovalPathDTO> getNextApprovalPaths(@Param("approvalId") int approvalId, @Param("sequence") int sequence);

    // 특정 결재 합의 정보를 가져오는 쿼리문
    @Select(
            "SELECT consensus_id AS consensusId, approval_id AS approvalId, employee_code AS employeeCode, status, created_at AS createdAt " +
                    "FROM approval_consensus " +
                    "WHERE approval_id = #{approvalId} " +
                    "AND employee_code = #{employeeCode}"
    )
    ApprovalConsensusDTO getApprovalConsensusByApprovalIdAndEmployeeCode(@Param("approvalId") int approvalId, @Param("employeeCode") String employeeCode);

    // 결재 합의의 상태를 업데이트하는 쿼리문
    @Update(
            "UPDATE approval_consensus " +
                    "SET status = #{status} " +
                    "WHERE approval_id = #{approvalId} " +
                    "AND employee_code = #{employeeCode}"
    )
    void updateApprovalConsensusStatus(ApprovalConsensusDTO consensusDTO);

    // 다음 결재 합의 정보를 가져오는 쿼리문
    @Select(
            "SELECT consensus_id AS consensusId, approval_id AS approvalId, employee_code AS employeeCode, status, created_at AS createdAt " +
                    "FROM approval_consensus " +
                    "WHERE approval_id = #{approvalId} " +
                    "AND consensus_id > #{consensusId}"
    )
    List<ApprovalConsensusDTO> getNextApprovalConsensuses(@Param("approvalId") int approvalId, @Param("consensusId") int consensusId);

    // 내가 수신 합의된 목록을 가져오는 쿼리문
    @Select(
            "SELECT a.approval_id AS approvalId, t.title AS fileCd, e.name AS employeeName, ac.status, a.created_at AS createdAt " +
                    "FROM approval a " +
                    "JOIN approval_consensus ac ON a.approval_id = ac.approval_id " +
                    "JOIN employee e ON a.employee_code = e.employee_code " +
                    "JOIN templates t ON a.file_cd = t.file_cd " +
                    "WHERE ac.employee_code = #{employeeCode} " +
                    "AND ac.status = '미결' " +
                    "ORDER BY a.created_at DESC"
    )
    List<ApprovalDTO> selectMyConsensusApprovals(String employeeCode);

    // 내가 상신한 것과 나에게 수신 참조된 것 중에서 완료된 목록을 가져오는 쿼리문
    @Select(
            "SELECT a.approval_id AS approvalId, t.title AS fileCd, e.name AS employeeName, a.status, a.created_at AS createdAt " +
                    "FROM approval a " +
                    "JOIN employee e ON a.employee_code = e.employee_code " +
                    "JOIN templates t ON a.file_cd = t.file_cd " +
                    "WHERE a.employee_code = #{employeeCode} " +
                    "AND a.status = '완결' " +
                    "UNION ALL " +
                    "SELECT a.approval_id AS approvalId, t.title AS fileCd, e.name AS employeeName, a.status, a.created_at AS createdAt " +
                    "FROM approval a " +
                    "JOIN approval_references ar ON a.approval_id = ar.approval_id " +
                    "JOIN employee e ON a.employee_code = e.employee_code " +
                    "JOIN templates t ON a.file_cd = t.file_cd " +
                    "WHERE ar.employee_code = #{employeeCode} " +
                    "AND a.status = '완결' " +
                    "ORDER BY createdAt DESC"
    )
    List<ApprovalDTO> selectMyCompletedApprovals(String employeeCode);

    // approvalId를 기준으로 해당 테이블의 모든 데이터를 가져오는 쿼리문
    @Select("SELECT a.approval_id AS approvalId, " +
            "a.employee_code AS employeeCode, " +
            "d.department_id AS departmentCode, " +
            "d.department_name AS departmentName, " +
            "a.file_cd AS fileCd, " +
            "a.content, " +
            "a.status, " +
            "a.created_at AS createdAt, " +
            "a.duedate_at AS duedateAt, " +
            "e.name AS employeeName, " +
            "t.title AS fileName " +
            "FROM approval a " +
            "JOIN employee e ON a.employee_code = e.employee_code " +
            "JOIN department d ON e.department_id = d.department_id " +
            "JOIN templates t ON a.file_cd = t.file_cd " +
            "WHERE a.approval_id = #{approvalId}")
    @Results({
            @Result(property = "approvalId", column = "approvalId"),
            @Result(property = "employeeCode", column = "employeeCode"),
            @Result(property = "fileCd", column = "fileCd"),
            @Result(property = "content", column = "content"),
            @Result(property = "status", column = "status"),
            @Result(property = "createdAt", column = "createdAt"),
            @Result(property = "duedateAt", column = "duedateAt"),
            @Result(property = "employeeName", column = "employeeName"),
            @Result(property = "fileName", column = "fileName"),
            @Result(property = "departmentCode", column = "departmentCode"),
            @Result(property = "departmentName", column = "departmentName")
    })
    ApprovalDTO selectApprovalByApprovalId(int approvalId);

    // approvalId를 기준으로 approval_path 테이블의 데이터를 가져오는 쿼리문
    @Select("SELECT a.path_id AS pathId, " +
            "a.approval_id AS approvalId, " +
            "a.employee_code AS employeeCode, " +
            "a.sequence, " +
            "a.status, " +
            "a.file_cd AS fileCd, " +
            "d.department_name AS departmentName, " +
            "e.name AS employeeName " +
            "FROM approval_path a " +
            "JOIN employee e ON a.employee_code = e.employee_code " +
            "JOIN department d on e.department_id = d.department_id " +
            "WHERE approval_id = #{approvalId}")
    List<ApprovalPathDTO> selectApprovalPathsByApprovalId(int approvalId);

    // approvalId를 기준으로 approval_references 테이블의 데이터를 가져오는 쿼리문
    @Select("SELECT a.reference_id AS referenceId, " +
            "a.approval_id AS approvalId, " +
            "a.employee_code AS employeeCode, " +
            "d.department_name AS departmentName, " +
            "e.name AS employeeName " +
            "FROM approval_references a " +
            "JOIN employee e ON a.employee_code = e.employee_code " +
            "JOIN department d on e.department_id = d.department_id " +
            "WHERE approval_id = #{approvalId} " +
            "AND e.ps_cd != 'P001'")
    List<ApprovalReferencesDTO> selectApprovalReferencesByApprovalId(int approvalId);

    // approvalId를 기준으로 approval_consensus 테이블의 데이터를 가져오는 쿼리문
    @Select("SELECT a.consensus_id AS consensusId, " +
            "a.approval_id AS approvalId, " +
            "a.employee_code AS employeeCode, " +
            "a.status, " +
            "a.created_at AS createdAt, " +
            "d.department_name AS departmentName, " +
            "e.name AS employeeName " +
            "FROM approval_consensus a " +
            "JOIN employee e ON a.employee_code = e.employee_code " +
            "JOIN department d ON e.department_id = d.department_id " +
            "WHERE approval_id = #{approvalId}")
    List<ApprovalConsensusDTO> selectApprovalConsensusesByApprovalId(int approvalId);

    @Select("SELECT a.path_id AS pathId, " +
            "a.approval_id AS approvalId, " +
            "a.employee_code AS employeeCode, " +
            "a.sequence, " +
            "a.status, " +
            "a.file_cd AS fileCd, " +
            "d.department_name AS departmentName, " +
            "e.name AS employeeName " +
            "FROM approval_path a " +
            "JOIN employee e ON a.employee_code = e.employee_code " +
            "JOIN department d on e.department_id = d.department_id " +
            "WHERE approval_id = #{approvalId} AND sequence < #{sequence}")
    List<ApprovalPathDTO> getPreviousApprovalPaths(int approvalId, int sequence);
}
