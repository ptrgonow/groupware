package com.groupware.work.controller;


import com.groupware.approval.dto.ApprovalDTO;
import com.groupware.approval.dto.DeptTreeDTO;
import com.groupware.approval.dto.EmployeeDTO;
import com.groupware.approval.dto.PositionsDTO;
import com.groupware.approval.service.ApService;
import com.groupware.user.dto.DeptDTO;
import com.groupware.user.dto.PositionDTO;
import com.groupware.user.dto.UserDTO;
import com.groupware.user.service.UserService;
import com.groupware.work.hr.dto.HrEmplMagDTO;
import com.groupware.work.hr.dto.HrEmployeeDTO;
import com.groupware.work.hr.service.HrService;
import com.groupware.work.ms.dto.AllEmployeeDTO;
import com.groupware.work.ms.dto.MsApprovalDTO;
import com.groupware.work.ms.service.MsService;
import com.groupware.work.pm.dto.PmDTO;
import com.groupware.work.pm.service.PmService;
import jakarta.servlet.http.HttpSession;
import org.apache.catalina.User;
import com.groupware.work.dev.dto.ProjectDTO;
import com.groupware.work.dev.service.DevService;
import com.groupware.work.hr.dto.TodayWorkerDTO;
import com.groupware.user.dto.UserDTO;
import com.groupware.work.hr.service.HrService;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;
import java.util.List;

@Controller
@AllArgsConstructor
public class WorkViewController {

    private final HrService hrService;
    private final DevService devService;
    private final MsService msService;
    private final PmService pmService;


    @GetMapping("/fm")
    public String fm(Model model, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");
        if (user == null) {
            return "redirect:/loginPage"; // 로그인 페이지로 리다이렉트
        }
        model.addAttribute("user", user);
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
    public String hr(Model model, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");
        if (user == null) {
            return "redirect:/loginPage"; // 로그인 페이지로 리다이렉트
        }
        model.addAttribute("user", user);

        // 총 직원 수
        int eCount = hrService.AllEmployeeCount();
        // 인원현황 대시보드
        List<HrEmployeeDTO> eList = hrService.getAllEmployees();
        // 결재 요청 개수
        int apCount = hrService.AllApprovalCount();
        // P001에 해당하는 사원
        List<HrEmployeeDTO> mList = hrService.getManagerEmployee();

        List<HrEmployeeDTO> hrManagers = new ArrayList<>();
        List<HrEmployeeDTO> financeManagers = new ArrayList<>();
        List<HrEmployeeDTO> developManagerF = new ArrayList<>();
        List<HrEmployeeDTO> developManagerS = new ArrayList<>();

        for (HrEmployeeDTO manager : mList) {
            if (manager.getDepartmentId() == 9) {  //인사
                hrManagers.add(manager);
            }else if (manager.getDepartmentId() == 10) {  //재무
                financeManagers.add(manager);
            }else if (manager.getDepartmentId() == 4) {  //개발1팀
                developManagerF.add(manager);
            }else if (manager.getDepartmentId() == 7) {  //개발2팀
                developManagerS.add(manager);
            }
        }

        model.addAttribute("eCount", eCount);
        model.addAttribute("eList", eList);
        model.addAttribute("apCount", apCount);
        model.addAttribute("mList", mList);
        model.addAttribute("hrManagers", hrManagers);
        model.addAttribute("financeManagers", financeManagers);
        model.addAttribute("developManagerF", developManagerF);
        model.addAttribute("developManagerS", developManagerS);
      

        List<TodayWorkerDTO> workers = hrService.getAllTodayWorkers();

        model.addAttribute("workers", workers); // 모델에 데이터 추가
        return "work/hr/main-hr";
    }

    // 직원 관리
    @GetMapping("/hr/edit")
    public String getEmployeeMag(Model model) {
        List<HrEmplMagDTO> empMag = hrService.getEmplManagement();
        model.addAttribute("empMag", empMag);

        return "work/hr/hr-edit";
    }

    @GetMapping("/registerPage")
    public String registerPage() {
        return "work/hr/hr-register";
    }


    @GetMapping("/dev")
    public String dev(Model model, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");
        if (user == null) {
            return "redirect:/loginPage"; // 로그인 페이지로 리다이렉트
        }
        List<ProjectDTO> projects = devService.getProjects(user.getEmployeeCode());
        model.addAttribute("user", user);
        model.addAttribute("projects", projects);

        return "work/dev/main-dev"; // 뷰 이름 반환
    }

    @GetMapping("/dev/add")
    public String addProject(Model model, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");
        if (user == null) {
            return "redirect:/loginPage"; // 로그인 페이지로 리다이렉트
        };
        model.addAttribute("user", user);
        return "work/dev/add-dev";
    }


    @GetMapping("/ms")
    public String ms(Model model, HttpSession session){
        UserDTO user = (UserDTO) session.getAttribute("user");
        if (user == null) {
            return "redirect:/loginPage"; // 로그인 페이지로 리다이렉트
        }
        List<AllEmployeeDTO> allEmployee = msService.getAllEmployees();
        List<MsApprovalDTO> getApproval = msService.getAllApprovals();
        List<MsApprovalDTO> getFmApproval = msService.getFmApproval();
        model.addAttribute("user", user).addAttribute("allEmployee", allEmployee).addAttribute("Approval", getApproval)
                .addAttribute("FmApproval", getFmApproval);

        return "work/ms/main-ms";
    }

    @GetMapping("/pm")
    public String pm(Model model, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");
        if (user == null) {
            return "redirect:/loginPage"; // 로그인 페이지로 리다이렉트
        }
        List<ProjectDTO> projects = pmService.getProjects();
        List<PmDTO> meetings = pmService.getMeetings();
        model.addAttribute("user", user).addAttribute("projects", projects)
                .addAttribute("meeting", meetings);

        return "work/pm/main-pm";
    }

    @GetMapping("/ceo")
    public  String ceo()    {




        return "work/ms/ceo";
    }


}

