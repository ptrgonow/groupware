package com.groupware;

import com.groupware.notice.dto.NoticeDTO;
import com.groupware.notice.service.NoticeService;
import com.groupware.user.dto.UserDTO;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@Controller
public class MainController {

    private final NoticeService noticeService;

    public MainController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @GetMapping("/")
    public String index(Model model, HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("user");
        List<NoticeDTO> nlist = noticeService.getAllNotices();
        if (user != null) {
            model.addAttribute("user", user);
            model.addAttribute("employeeCode", user.getEmployeeCode());
            model.addAttribute("departmentId", user.getDepartmentId());
            model.addAttribute("notices", nlist);
            System.out.println("User is set in session with employee code: " + user.getEmployeeCode());
            System.out.println("User is set in session with department id: " + user.getDepartmentId());
        } else {
            System.out.println("User is not set in session");
        }
        return "index";
    }

    @GetMapping("/no")
    public String error(HttpServletResponse response) throws IOException {

        response.setContentType("text/html; charset=UTF-8");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();
        out.println("<script>alert('로그인이 필요한 서비스입니다.'); location.href='/';</script>");

        return null;
    }
}
