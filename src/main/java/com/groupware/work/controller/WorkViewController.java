package com.groupware.work.controller;

import com.groupware.work.hr.dto.TodayWorkerDTO;
import com.groupware.user.dto.UserDTO;
import com.groupware.work.hr.service.HrService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class WorkViewController {

    private final HrService hrService;

    public WorkViewController(HrService hrService) {
        this.hrService = hrService;
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
        List<TodayWorkerDTO> workers = hrService.getAllTodayWorkers();
        model.addAttribute("workers", workers); // 모델에 데이터 추가
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

