package com.groupware.work.fm.mapper;

import com.groupware.work.fm.dto.FmDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FmMapper {

    /* employee 테이블에서 관리자 코드 가져오기. P001 은 관리자 */
    @Select("SELECT employee_code FROM employee WHERE ps_cd = 'P001'")
    String getManagerEmployeeCode();


    @Select("SELECT fe.expense_id, fe.item_name, fe.amount, fe.date, fe.employee_code " +
            "FROM fixed_expenses fe " +
            "JOIN approval_path ap ON fe.expense_id = ap.expense_id " +
            "WHERE ap.status = 'approved' AND ap.approver_employee_code = #{approverEmployeeCode}")
    List<FmDTO> getApprovedFixedExpenses(@Param("approverEmployeeCode") String approverEmployeeCode);
/*
뭐가 맞는지 몰르겠음. 잠시 보류.
approval_path 의 status 에서 Approved 를 확인되면,
employee 테이블에서 ps_cd 에서 P001 (관리자)코드를 찾고 해당 코드에 맞는 부서의 관리자 아이디를 조회해서 자격이 되는지 확인이 되면
다음 단계인 차트에 변동 사항 (=추가 지출) 이 자동으로 업데이트 되야 한다.

@Select("SELECT fe.expense_id, fe.item_name, fe.amount, fe.date, fe.employee_code " +
            "FROM fixed_expenses fe " +
            "JOIN approval_path ap ON fe.expense_id = ap.expense_id " +
            "WHERE ap.status = 'approved' AND ap.approver_code = #{approverCode}")
    List<FmDTO> getApprovedFixedExpenses(@Param("approverCode") String approverCode);
*/

    @Insert("INSERT INTO fixed_expenses (item_name, amount, date, employee_code) " +
            "VALUES (#{itemName}, #{amount}, #{date}, #{employeeCode})")
    void logFixedExpense(FmDTO fixedExpenseDTO);
}
