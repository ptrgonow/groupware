package com.groupware.approval.controller;


import com.groupware.approval.dto.ApprovalDTO;
import com.groupware.approval.service.ApService;
import com.groupware.user.dto.UserDTO;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;


@Controller
@RequestMapping("/ap")
@RequiredArgsConstructor
public class ApController {

    private final ApService apService;


    @GetMapping("/amain")
    public String approval(Model model, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");

        if(user != null) {
            model.addAttribute("user", user);
            // 내가 올린 결재 리스트
            List<ApprovalDTO> mySubmissions = apService.getMySubmittedApprovals(user.getEmployeeCode());
            // 내가 처리해야 할 결재 리스트
            List<ApprovalDTO> myPendingApprovals = apService.getMyPendingApprovals(user.getEmployeeCode());
            // 나에게 수신 합의된 결재 리스트
            List<ApprovalDTO> myReceivedApprovals = apService.selectMyConsensusApprovals(user.getEmployeeCode());
            // 올린것과 받은것중에 완결된것만 가져오기
            List<ApprovalDTO> myCompletedApprovals = apService.selectMyCompletedApprovals(user.getEmployeeCode());

            model.addAttribute("mySubmissions", mySubmissions);
            model.addAttribute("myPendingApprovals", myPendingApprovals);
            model.addAttribute("myReceivedApprovals", myReceivedApprovals);
            model.addAttribute("myCompletedApprovals", myCompletedApprovals);

            return "/approval/main-approval";
        }
        return "redirect:/loginPage";
    }

    @GetMapping("/write")
    public String write(Model model, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");

        if(user != null) {
            model.addAttribute("user", user);
            return "/approval/approval-form";
        }
        return "redirect:/loginPage";
    }


}
