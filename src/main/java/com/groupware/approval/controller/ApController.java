package com.groupware.approval.controller;


import com.groupware.approval.dto.ApprovalDTO;
import com.groupware.approval.dto.ApprovalDetailsDTO;
import com.groupware.approval.dto.ApprovalPathDTO;
import com.groupware.approval.service.ApService;
import com.groupware.approval.service.TokenService;
import com.groupware.user.dto.UserDTO;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;


@Controller
@RequestMapping("/ap")
@RequiredArgsConstructor
public class ApController {

    private final ApService apService;
    private final TokenService tokenService;


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

    @GetMapping("/gt/{approvalId}")
    @ResponseBody
    public String generateToken(@PathVariable("approvalId") int approvalId) {
        return tokenService.generateToken(approvalId);
    }


    @GetMapping("/detail/{token}")
    public String detail(@PathVariable("token") String token, Model model, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");

        if (user != null) {
            Integer approvalId = tokenService.getApprovalIdFromToken(token);
            if (approvalId != null) {
                model.addAttribute("user", user);
                ApprovalDetailsDTO approval = apService.getApprovalDetail(approvalId);
                model.addAttribute("approval", approval.getApprovalDTO());
                model.addAttribute("paths", approval.getApprovalPaths());
                model.addAttribute("references", approval.getApprovalReferences());
                model.addAttribute("consensuses", approval.getApprovalConsensuses());
                boolean isApprove = apService.checkIfUserIsApprove(user, approval.getApprovalPaths());
                boolean isConsensus = apService.checkIfUserIsConsensus(user, approval.getApprovalConsensuses());
                boolean isConsensusStatus = apService.checkIfConsensusStatus(user, approval.getApprovalConsensuses());

                String userStatus;
                String isConsensusStatusStr = isConsensusStatus ? "미결" : "합의";

                if (isApprove) {
                    userStatus = "APPROVE";
                } else if (isConsensus) {
                    userStatus = "CONSENSUS";
                } else {
                    userStatus = "NONE";
                }



                model.addAttribute("userStatus", userStatus);
                model.addAttribute("checkConsensus", isConsensus);
                model.addAttribute("consensusStatus", isConsensusStatusStr);
                return "approval/approval-detail";
            }
        }
        return "redirect:/ap/amain";
    }



}
