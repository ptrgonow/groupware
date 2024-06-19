package com.groupware.work.fm.mapper;

import com.groupware.approval.dto.ApprovalDTO;
import com.groupware.work.fm.dto.SalaryDTO;
import com.groupware.approval.dto.DeptTreeDTO;
import com.groupware.work.fm.dto.FixedExpensesDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface FmMapper {

    /* 고정지출 관련 차트 업데이트 */
    @Select("SELECT expense_id AS expenseId, item_name AS itemName, amount, issue_date AS date, employee_code AS employeeCode FROM fixed_expenses")
    List<FixedExpensesDTO> getFixedExpenses();

    /* expense_category_mapping 라는 매핑 테이블을 활용하여 fixed_expenses 테이블의 데이터를 가져올 때 매핑된 카테고리로 변환 */
    @Select("SELECT fe.expense_id, fe.item_name, fe.amount, fe.issue_date, fe.employee_code, ecm.category_name " +
            "FROM fixed_expenses fe " +
            "JOIN expense_category_mapping ecm ON fe.item_name = ecm.item_name")
    List<FixedExpensesDTO> getFixedExpensesWithCategory();

    /* approval 테이블에 status 가 완료인 데이터 가져오기 */
    @Select("SELECT fe.expense_id, fe.item_name, fe.amount, fe.issue_date, fe.employee_code, ecm.category_name " +
            "FROM fixed_expenses fe " +
            "JOIN expense_category_mapping ecm ON fe.item_name = ecm.item_name " +
            "JOIN approval a ON fe.employee_code = a.employee_code AND fe.issue_date = a.created_at " +
            "WHERE a.status = '완료' AND a.file_cd = #{fileCd}")
    List<FixedExpensesDTO> getCompletedFixedExpenses(@Param("fileCd") String fileCd);



    /*   -- CHART END --   */


    /* 부서별 임직원 연봉 정보 띄우기 */
    @Select("SELECT * FROM department")
    List<DeptTreeDTO> getDepartments();

    @Select("WITH RECURSIVE SubDepartments AS ( " +
            "SELECT department_id " +
            "FROM department " +
            "WHERE department_id = #{departmentId} " +
            "UNION ALL " +
            "SELECT d.department_id " +
            "FROM department d " +
            "INNER JOIN SubDepartments sd ON d.parent_department_id = sd.department_id " +
            ") " +
            "SELECT s.salary_id AS salaryId, " +
            "s.employee_code AS employeeCode, " +
            "s.description, " +
            "s.hiredate, " +
            "s.amount, " +
            "d.department_name AS departmentName, " +
            "p.ps_nm AS positionName " +
            "FROM salary s " +
            "JOIN employee e ON s.employee_code = e.employee_code " +
            "JOIN department d ON e.department_id = d.department_id " +
            "JOIN positions p ON e.ps_cd = p.ps_cd " +
            "WHERE e.department_id IN (SELECT department_id FROM SubDepartments)")
    List<SalaryDTO> getSalariesByDepartment(@Param("departmentId") int departmentId);

    /*   -- SALARY BY DEPARTMENT END --   */


    /* 연봉 정보 테이블을 보기 위한 비밀번호 */
    @Select("SELECT password FROM employee WHERE username = #{username}")
    String getPasswordByUsername(@Param("username") String username);
/*   -- PASSWORD TO VIEW SALARY INFO END --   */
}
