package com.groupware.work.controller;

import com.groupware.approval.dto.DeptTreeDTO;
import com.groupware.approval.dto.EmployeeDTO;
import com.groupware.approval.dto.PositionsDTO;
import com.groupware.approval.service.ApService;
import com.groupware.user.dto.DeptDTO;
import com.groupware.user.dto.PositionDTO;
import com.groupware.user.dto.UserDTO;
import com.groupware.user.service.UserService;
import com.groupware.work.hr.dto.HrEmployeeDTO;
import com.groupware.work.hr.service.HrService;
import jakarta.servlet.http.HttpSession;
import org.apache.catalina.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class WorkViewController {

    private final HrService hrService;
    private final UserService userService;

    public WorkViewController(HrService hrService, UserService userService, ApService apService, UserService userService1) {
        this.hrService = hrService;
        this.userService = userService;
    }

    @GetMapping("/fm")
    public String fm(Model model) {
        model.addAttribute("test", 120);
        return "work/fm/main-finance";
    }

    @GetMapping("/fm/eform")
    public String eform() {
        return "work/fm/eform-finance";
    }
    @GetMapping("/fm/eform-draft")
    public String eformDraft() {

        return "file/eform-draft";
    }

    @GetMapping("/hr")
    public String hr(Model model) {

        // 총 직원 수
        int eCount = hrService.AllEmployeeCount();
        // 인원현황 대시보드
        List<HrEmployeeDTO> eList = hrService.getAllEmployees();
        // 결재 요청 개수
        int apCount = hrService.AllApprovalCount();

        model.addAttribute("eCount", eCount);
        model.addAttribute("eList", eList);
        model.addAttribute("apCount", apCount);

        return "work/hr/main-hr";
    }

    @GetMapping("/registerPage")
    public String registerPage() {
        return "work/hr/hr-register";
    }

    @GetMapping("/dev")
    public String dev(Model model, HttpSession session) {

        UserDTO user = (UserDTO) session.getAttribute("user");
        model.addAttribute("employeeCode", user.getEmployeeCode());

        return "work/dev/main-dev";
    }

}

