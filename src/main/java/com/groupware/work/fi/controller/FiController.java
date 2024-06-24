package com.groupware.work.fi.controller;

import com.groupware.approval.dto.ApprovalDTO;
import com.groupware.user.dto.UserDTO;
import com.groupware.work.fi.dto.SalDTO;
import com.groupware.work.fi.service.FiService;

import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@AllArgsConstructor
public class FiController {

    private final FiService fiService;

    @GetMapping("/fi")
    public String fi (Model model, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");
        if (user == null) {
            return "redirect:/loginPage"; // 로그인 페이지로 리다이렉트
        }
        List<ApprovalDTO> financeApprovalList = fiService.getFinanceApprovalList();

        model.addAttribute("fList", financeApprovalList);
        model.addAttribute("user", user);
        return "work/fm/finance";
    }

    @GetMapping("/fi/sal/list")
    public ResponseEntity<Map<String, Object>> getAllMemberSalary() {

        List<SalDTO> allMemberSalary = fiService.getAllMemberSalary();
        Map<String, Object> sList = new HashMap<>();
        int totalItem = allMemberSalary.size();
        sList.put("totalItem", totalItem);
        sList.put("salList", allMemberSalary);
        return ResponseEntity.ok(sList);
    }

}
